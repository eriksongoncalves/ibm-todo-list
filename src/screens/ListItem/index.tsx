import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  FlatList,
  BackHandler,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import {
  TabActions,
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { useTheme } from 'styled-components/native'
import firestore from '@react-native-firebase/firestore'
import {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Ionicons
} from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useForm, Controller } from 'react-hook-form'
import uuid from 'react-native-uuid'
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GOOGLE_AI_API_KEY } from '@env'
import { useNetInfo } from '@react-native-community/netinfo'

import * as S from './styles'
import {
  ItemFormData,
  itemFormResolver,
  suggestionItemsSchema
} from './validationSchema'

import { ListData, ListItemData } from '@shared/types/dtos/Lists'
import { Button } from '@components/Button'
import { Text } from '@components/Text'
import { Empty } from '@components/Empty'
import { Disconnected } from '@components/Disconnected'
import { LoadingScreen } from '@components/LoadingScreen'
import { Input, SuggestionsList } from '@components/Input'
import { BottomModalWrapper } from '@components/BottomModalWrapper'
import { Radio } from '@components/Radio'
import { useDebounce } from '@hooks/useDebounce'
import { logEvent, EVENT_TYPE } from '@utils/analitycs'

type RouteParams = {
  listId: string
  name: string
}

const filterStatusData = [
  { label: 'Todos', value: '' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Concluídas', value: 'done' }
]

export function ListItem() {
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { debounce } = useDebounce()
  const netInfo = useNetInfo()

  const { listId, name: listName } = route.params as RouteParams

  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formDeleteLoading, setFormDeleteLoading] = useState(false)
  const [itemSelected, setItemSelected] = useState<ListItemData>()
  const [listData, setListData] = useState<ListData>()
  const [statusFilterSelected, setStatusFilterSelected] = useState<string>()
  const [suggestionsList, setSuggestionsList] = useState<SuggestionsList[]>([])

  const formBottomSheetRef = useRef<BottomSheetModal>(null)
  const ref = useRef<IDropdownRef>(null)

  const formSnapPoints = useMemo(
    () => [itemSelected ? '77%' : '74%'],
    [itemSelected]
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ItemFormData>({
    resolver: itemFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  async function onSaveItem(data: ItemFormData) {
    if (!netInfo.isConnected) {
      Toast.show({
        visibilityTime: 3000,
        topOffset: 0,
        type: 'error',
        text1: 'Opss...',
        text2: 'Parece que você está sem internet, conecte-se para continuar.'
      })

      return
    }

    try {
      setFormLoading(true)
      const dateUpdatedOrCreated = new Date()

      let items: ListItemData[] = listData!.items || []

      if (itemSelected) {
        items = items.map(item => {
          return item.id === itemSelected.id
            ? {
                ...item,
                ...data,
                updated_at: dateUpdatedOrCreated
              }
            : item
        }) as ListItemData[]
      } else {
        items.push({
          id: String(uuid.v4()),
          ...data,
          created_at: dateUpdatedOrCreated,
          updated_at: dateUpdatedOrCreated
        })
      }

      await firestore()
        .collection('lists')
        .doc(listData!.id)
        .update({
          items: items.map(item => ({
            ...item,
            created_at: firestore.Timestamp.fromDate(item.created_at),
            updated_at: firestore.Timestamp.fromDate(item.updated_at)
          }))
        })

      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'ListItem',
        elementName: 'Salvar',
        description: `${itemSelected ? 'Editou' : 'Criou'} o item "${data.description}" da lista "${listName}"`
      })

      setListData(prevState => ({
        ...prevState!,
        items
      }))

      Toast.show({
        visibilityTime: 4000,
        position: 'bottom',
        type: 'success',
        text1: '\\o/',
        text2: `Item ${itemSelected ? 'atualizado' : 'adicionado'} com sucesso!`
      })
    } catch (e) {
      Toast.show({
        visibilityTime: 2000,
        topOffset: 0,
        type: 'error',
        text1: 'Opss...',
        text2: 'Ocorreu um erro ao salvar os dados'
      })
    } finally {
      setFormLoading(false)
      handleCloseFormModal()
    }
  }

  async function handleCompleteItem(data: ListItemData) {
    if (!netInfo.isConnected) {
      Toast.show({
        visibilityTime: 3000,
        topOffset: 0,
        type: 'error',
        text1: 'Opss...',
        text2: 'Parece que você está sem internet, conecte-se para continuar.'
      })

      return
    }

    try {
      const dateUpdatedOrCreated = new Date()

      const items: ListItemData[] = (listData?.items || []).map(item => {
        if (item.id === data.id) {
          return {
            ...item,
            status: data.status === 'done' ? 'pending' : 'done',
            updated_at: dateUpdatedOrCreated
          }
        }

        return item
      })

      setListData(prevState => ({
        ...prevState!,
        items
      }))

      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'ListItem',
        elementName: 'Editar',
        description: `Marcou o item ${data.description} como completo da lista ${listName}`
      })

      await firestore()
        .collection('lists')
        .doc(listData!.id)
        .update({
          items: items.map(item => ({
            ...item,
            created_at: firestore.Timestamp.fromDate(item.created_at),
            updated_at: firestore.Timestamp.fromDate(item.updated_at)
          }))
        })
    } catch (e) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: 'Ocorreu um erro ao finalizar o item'
      })

      setListData(prevState => ({
        ...prevState!,
        items: prevState!.items.map(item => {
          return item.id === data.id ? data : item
        })
      }))
    }
  }

  function handleOpenFormModal() {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'ListItem',
      elementName: 'Adicionar',
      description: `Clicou em adicionar um item na lista "${listName}"`
    })

    formBottomSheetRef.current?.present()
    setItemSelected(undefined)
    reset({
      description: '',
      status: 'pending',
      comments: ''
    })
  }

  function handleEdit(data: ListItemData) {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'ListItem',
      elementName: 'Editar',
      description: `Clicou em editar o item "${data.description}" da lista "${listName}"`
    })

    setItemSelected(data)
    reset({
      description: data.description,
      status: data.status,
      comments: data.comments
    })
    formBottomSheetRef?.current?.present()
  }

  function handleCloseFormModal() {
    formBottomSheetRef.current?.dismiss()
    reset()
    setItemSelected(undefined)
    clearSuggestionList()
  }

  async function handleDeleteItem() {
    try {
      setFormDeleteLoading(true)

      const items =
        listData?.items.filter(item => item.id !== itemSelected?.id) || []

      await firestore().collection('lists').doc(listData?.id).update({
        items
      })

      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'ListItem',
        elementName: 'Deletar',
        description: `Deletou o item "${itemSelected?.description}" da lista "${listName}"`
      })

      setListData(prevState => ({
        ...prevState!,
        items
      }))

      Toast.show({
        visibilityTime: 2000,
        type: 'success',
        text1: '\\o/',
        text2: 'Item deletado com sucesso!'
      })

      handleCloseFormModal()
    } catch (e) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: 'Ocorreu um erro ao deletar o item da lista'
      })
    } finally {
      setFormDeleteLoading(false)
    }
  }

  function handleConfirmDeleteItem() {
    if (itemSelected) {
      if (!netInfo.isConnected) {
        Toast.show({
          visibilityTime: 3000,
          topOffset: 0,
          type: 'error',
          text1: 'Opss...',
          text2: 'Parece que você está sem internet, conecte-se para continuar.'
        })

        return
      }

      logEvent(EVENT_TYPE.ACTION, {
        screen: 'ListItem',
        elementName: 'Deletar',
        description: `Clicou em deletar o item "${itemSelected.description}" da lista "${listName}"`
      })

      Alert.alert('Confirmação', `Deseja realmente remover este item?`, [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        { text: 'Confirmar', onPress: handleDeleteItem }
      ])
    }
  }

  function clearSuggestionList() {
    suggestionsList.length > 0 && setSuggestionsList([])
  }

  function getSuggestions(textInput: string) {
    if (GOOGLE_AI_API_KEY && netInfo.isConnected) {
      debounce(() => {
        if (typeof textInput !== 'string' || textInput.trim().length < 3) {
          clearSuggestionList()
          return
        }

        const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        model
          .generateContent(
            `Gere 5 items para um todolist chamado "${listName}" que comece com "${textInput}", o retorno deve ser um json contendo um array de objetos com o atributo item e seu valor`
          )
          .then(({ response }) => {
            if (response && response?.candidates) {
              const text = response.candidates[0]?.content.parts[0]?.text

              if (text) {
                const textFormatted = text
                  .replace(/```\w*n/g, '')
                  .replace(/\n```/g, '')
                  .trim()
                const textToJson = JSON.parse(textFormatted)

                const { success, data } =
                  suggestionItemsSchema.safeParse(textToJson)
                const suggestions = success ? data : []

                setSuggestionsList(suggestions)
              } else {
                clearSuggestionList()
              }
            } else {
              clearSuggestionList()
            }
          })
          .catch(() => {
            clearSuggestionList()
          })
      }, 500)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          variant="ghost"
          onPress={() => {
            logEvent(EVENT_TYPE.ACTION, {
              screen: 'ListItem',
              elementName: 'Back',
              description: `Voltou para as listas`
            })

            const jumpToAction = TabActions.jumpTo('my_lists_tab')
            setLoading(true)
            navigation.dispatch(jumpToAction)
          }}
          ml={16}
        >
          <Ionicons
            name="arrow-back-sharp"
            size={24}
            color={theme.colors.green_500}
          />
        </Button>
      ),
      headerRight: () => (
        <S.HeaderIconButton onPress={handleOpenFormModal}>
          <MaterialIcons
            name="playlist-add"
            size={24}
            color={theme.colors.white}
          />
        </S.HeaderIconButton>
      )
    })

    navigation?.setOptions({
      tabBarStyle: { display: 'none' },
      tabBarVisible: false
    })
    return () =>
      navigation.setOptions({
        tabBarStyle: undefined,
        tabBarVisible: undefined
      })
  }, [navigation, theme])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setLoading(true)
          logEvent(EVENT_TYPE.ACTION, {
            screen: 'ListItem',
            elementName: 'Back',
            description: `Voltou para as listas`
          })

          const jumpToAction = TabActions.jumpTo('my_lists_tab')
          navigation.dispatch(jumpToAction)
          return true
        }
      )

      logEvent(EVENT_TYPE.PAGE_VIEW, {
        screen: 'ListItem'
      })

      firestore()
        .collection('lists')
        .doc(listId)
        .get()
        .then(response => {
          const listData = response.data() as ListData & {
            created_at: any
            updated_at: any
          }

          if (listData) {
            const itemsFormatted = listData?.items.map((item: any) => {
              return {
                ...item,
                created_at: new Date(item.created_at.toDate()),
                updated_at: new Date(item.updated_at.toDate())
              }
            })

            setListData({
              id: response.id,
              ...listData,
              items: itemsFormatted,
              created_at: new Date(listData.created_at.toDate()),
              updated_at: new Date(listData.updated_at.toDate())
            })
            setLoading(false)
          }
        })
        .catch(e => {
          setLoading(false)

          Toast.show({
            visibilityTime: 2000,
            type: 'error',
            text1: 'Opss...',
            text2: 'Ocorreu um erro ao carregar os itens da lista'
          })

          const jumpToAction = TabActions.jumpTo('my_lists_tab')
          navigation.dispatch(jumpToAction)
        })

      return () => backHandler.remove()
    }, [navigation, listId, listName, netInfo.isConnected])
  )

  const listItems = useMemo(() => {
    const items = listData?.items || []

    if (statusFilterSelected) {
      return items.filter(item => item.status === statusFilterSelected)
    }

    return items
  }, [listData?.items, statusFilterSelected])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
        clearSuggestionList()
      }}
      accessible={false}
    >
      <S.Wrapper>
        {!netInfo.isConnected ? (
          <Disconnected />
        ) : loading ? (
          <LoadingScreen />
        ) : listItems.length <= 0 && statusFilterSelected === undefined ? (
          <Empty
            description="Você ainda não tem nenhum item adicionado na sua lista!"
            actionDescription="Adicionar um item"
            onPress={handleOpenFormModal}
          />
        ) : (
          <S.ListWrapper>
            <S.Filter>
              <Text
                fontFamily="robotoBold"
                color="white"
                style={{ width: 'auto' }}
              >
                Filtrar por:
              </Text>

              <S.Select>
                <Dropdown
                  ref={ref}
                  data={filterStatusData}
                  style={{
                    borderRadius: 5,
                    backgroundColor: theme.colors.gray_600,
                    padding: 8
                    // marginLeft: 'auto'
                  }}
                  containerStyle={{
                    top: Platform.OS === 'ios' ? -20 : 2,
                    backgroundColor: theme.colors.gray_600,
                    borderColor: theme.colors.gray_300
                  }}
                  fontFamily={theme.fonts.family.roboto.regular}
                  activeColor={theme.colors.gray_500}
                  itemTextStyle={{
                    color: theme.colors.gray_300,
                    fontFamily: theme.fonts.family.roboto.regular
                  }}
                  placeholderStyle={{
                    color: theme.colors.gray_200,
                    fontFamily: theme.fonts.family.roboto.regular
                  }}
                  selectedTextStyle={{
                    color: theme.colors.gray_200,
                    fontFamily: theme.fonts.family.roboto.regular
                  }}
                  dropdownPosition="bottom"
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Todos"
                  value={statusFilterSelected}
                  closeModalWhenSelectedItem={false}
                  onChange={item => {
                    setStatusFilterSelected(item.value)
                    ref.current?.close()
                  }}
                />
              </S.Select>
            </S.Filter>

            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              data={listItems}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <S.Item>
                  <S.TitleWrapper>
                    <Radio
                      isChecked={item.status === 'done'}
                      onPress={() => handleCompleteItem(item)}
                    />

                    <Text
                      fontFamily="robotoBold"
                      size={18}
                      mb={4}
                      style={[
                        { flex: 1 },
                        item.status === 'done' && {
                          textDecorationLine: 'line-through'
                        }
                      ]}
                    >
                      {item.description}
                    </Text>

                    <Button variant="ghost" onPress={() => handleEdit(item)}>
                      <AntDesign
                        name="edit"
                        size={24}
                        color={theme.colors.gray_200}
                      />
                    </Button>
                  </S.TitleWrapper>
                </S.Item>
              )}
            />
          </S.ListWrapper>
        )}

        <BottomModalWrapper
          ref={formBottomSheetRef}
          snapPoints={formSnapPoints}
          title={`${itemSelected ? 'Editar item' : 'Novo item'}`}
          onClose={handleCloseFormModal}
          onDismiss={handleCloseFormModal}
        >
          <Text fontFamily="robotoBold" color="white" mb={8} mt={16}>
            Descrição
          </Text>

          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Descrição"
                onChangeText={text => {
                  clearSuggestionList()
                  onChange(text)
                  getSuggestions(text)
                }}
                value={value}
                errorMessage={errors.description?.message}
                mb={16}
                onBlur={() => {
                  clearSuggestionList()
                }}
                suggestions={suggestionsList}
                onSuggestionPress={item => {
                  onChange(item)
                  clearSuggestionList()
                }}
              />
            )}
          />
          <Text fontFamily="robotoBold" color="white" mb={8} mt={22}>
            Status
          </Text>
          <Controller
            name="status"
            control={control}
            render={({ field: { onChange, value } }) => (
              <S.StatusWrapper>
                <S.StatusButton
                  onPress={() => onChange('pending')}
                  isActive={!value || value === 'pending'}
                >
                  <Text color="white">Pendente</Text>
                </S.StatusButton>
                <S.StatusButton
                  onPress={() => onChange('in_progress')}
                  isActive={value === 'in_progress'}
                  style={{ flex: 1 }}
                >
                  <Text color="white">Em Andamento</Text>
                </S.StatusButton>
                <S.StatusButton
                  onPress={() => onChange('done')}
                  isActive={value === 'done'}
                >
                  <Text color="white">Concluída</Text>
                </S.StatusButton>
              </S.StatusWrapper>
            )}
          />
          <Text fontFamily="robotoBold" color="white" mb={8} mt={22}>
            Comentário
          </Text>
          <Controller
            name="comments"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Escreva aqui..."
                multiline
                numberOfLines={7}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.comments?.message}
                mb={16}
              />
            )}
          />
          <Button
            onPress={handleSubmit(onSaveItem)}
            loading={formLoading}
            disabled={formDeleteLoading}
          >
            <Text color="white">Salvar</Text>
          </Button>
          {itemSelected && (
            <Button
              variant="ghost"
              mt={16}
              onPress={handleConfirmDeleteItem}
              disabled={formDeleteLoading || formLoading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                gap: 8
              }}
            >
              <FontAwesome
                name="trash-o"
                size={22}
                color={theme.colors.red_600}
              />
              <Text fontFamily="robotoBold" color="red_600" ml={10} mt={8}>
                {formDeleteLoading ? 'Deletando...' : 'Deletar'}
              </Text>
            </Button>
          )}
        </BottomModalWrapper>
      </S.Wrapper>
    </TouchableWithoutFeedback>
  )
}
