import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { FlatList, BackHandler, Alert } from 'react-native'
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

import * as S from './styles'
import { ItemFormData, itemFormResolver } from './validationSchema'

import { ListData, ListItemData } from '@src/shared/types/dtos/Lists'
import { Button } from '@components/Button'
import { Text } from '@components/Text'
import { Empty } from '@components/Empty'
import { LoadingScreen } from '@components/LoadingScreen'
import { Input } from '@components/Input'
import { BottomModalWrapper } from '@components/BottomModalWrapper'
import { Radio } from '@components/Radio'

type RouteParams = {
  listId: string
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
  const { listId } = route.params as RouteParams

  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formDeleteLoading, setFormDeleteLoading] = useState(false)
  const [itemSelected, setItemSelected] = useState<ListItemData>()
  const [listData, setListData] = useState<ListData>()
  const [statusFilterSelected, setStatusFilterSelected] = useState<string>()

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
      console.log('>>> onSaveList error', e)
    } finally {
      setFormLoading(false)
      handleCloseFormModal()
    }
  }

  async function handleCompleteItem(data: ListItemData) {
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
      console.log('>>> handleCompleteItem error', e)
    }
  }

  function handleOpenFormModal() {
    formBottomSheetRef.current?.present()
    setItemSelected(undefined)
    reset({
      description: '',
      status: 'pending',
      comments: ''
    })
  }

  function handleEdit(data: ListItemData) {
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
  }

  async function handleDeleteItem() {
    try {
      setFormDeleteLoading(true)

      const items =
        listData?.items.filter(item => item.id !== itemSelected?.id) || []

      await firestore().collection('lists').doc(listData?.id).update({
        items
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
      console.log('>>> handleDeleteList Error', e)
    } finally {
      setFormDeleteLoading(false)
    }
  }

  function handleConfirmDeleteItem() {
    if (itemSelected) {
      Alert.alert('Confirmação', `Deseja realmente remover este item?`, [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        { text: 'Confirmar', onPress: handleDeleteItem }
      ])
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          variant="ghost"
          onPress={() => {
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
          const jumpToAction = TabActions.jumpTo('my_lists_tab')
          navigation.dispatch(jumpToAction)
          return true
        }
      )

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
    }, [navigation, listId])
  )

  const listItems = useMemo(() => {
    const items = listData?.items || []

    if (statusFilterSelected) {
      return items.filter(item => item.status === statusFilterSelected)
    }

    return items
  }, [listData?.items, statusFilterSelected])

  return (
    <S.Wrapper>
      {loading ? (
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
                  top: -20,
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
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
              mb={16}
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

      <Toast />
    </S.Wrapper>
  )
}
