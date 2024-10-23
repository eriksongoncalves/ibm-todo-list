import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome
} from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-toast-message'
import { useNetInfo } from '@react-native-community/netinfo'

import { ProgressBar } from '@components/ProgressBar'
import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { BottomModalWrapper } from '@components/BottomModalWrapper'
import { Empty } from '@components/Empty'
import { Disconnected } from '@components/Disconnected'
import { LoadingScreen } from '@components/LoadingScreen'
import { useAuth } from '@hooks/auth'
import { logEvent, EVENT_TYPE } from '@utils/analitycs'

import * as S from './styles'
import { ListFormData, listFormResolver } from './validationSchema'
import { ListData, ListItemData } from '@shared/types/dtos/Lists'

type ListDataProps = ListData & {
  id: string
  done: number
  total: number
}

export function MyLists() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user } = useAuth()
  const netInfo = useNetInfo()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ListFormData>({
    resolver: listFormResolver,
    mode: 'all',
    reValidateMode: 'onChange'
  })

  const formBottomSheetRef = useRef<BottomSheetModal>(null)
  const listMenuBottomSheetRef = useRef<BottomSheetModal>(null)

  const [listSelected, setListSelected] = useState<ListData>()
  const [listData, setListData] = useState<ListDataProps[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [forceEnableDismiss, setForceEnableDismiss] = useState(false)

  const formSnapPoints = useMemo(() => [290], [])
  const listMenuSnapPoints = useMemo(() => [270], [])

  async function onSaveList(data: ListFormData) {
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
      const firestoreDateUpdatedOrCreated =
        firestore.Timestamp.fromDate(dateUpdatedOrCreated)

      if (listSelected) {
        await firestore().collection('lists').doc(listSelected.id).update({
          name: data.name,
          updated_at: firestoreDateUpdatedOrCreated
        })

        setListData(prevState =>
          prevState.map(item => ({
            ...item,
            ...(item.id === listSelected.id
              ? { name: data.name, updated_at: dateUpdatedOrCreated }
              : {})
          }))
        )

        Toast.show({
          visibilityTime: 1500,
          topOffset: 0,
          type: 'success',
          text1: '\\o/',
          text2: 'Lista atualizada com sucesso!'
        })
      } else {
        const newItem = {
          name: data.name,
          user_id: user!.id,
          items: []
        }

        const doc = await firestore()
          .collection('lists')
          .add({
            ...newItem,
            created_at: firestoreDateUpdatedOrCreated,
            updated_at: firestoreDateUpdatedOrCreated
          })

        await logEvent(EVENT_TYPE.ACTION, {
          screen: 'MyLists',
          elementName: 'Salvar',
          description: `${listSelected ? 'Editou' : 'Criou'} a lista ${data.name}`
        })

        const newState = [
          ...listData,
          {
            id: doc.id,
            ...newItem,
            created_at: dateUpdatedOrCreated,
            updated_at: dateUpdatedOrCreated,
            done: 0,
            total: 0
          }
        ]

        setListData(newState)

        Toast.show({
          visibilityTime: 1500,
          topOffset: 0,
          type: 'success',
          text1: '\\o/',
          text2: 'Lista inserida com sucesso!'
        })
      }
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

  function handleCloseListMenuModal() {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'MyLists',
      elementName: 'Opções',
      description: `Fechou menu de opções da lista "${listSelected?.name}"`
    })

    listMenuBottomSheetRef?.current?.dismiss()
  }

  function handleCloseFormModal() {
    setForceEnableDismiss(true)
    formBottomSheetRef.current?.dismiss()
    reset({ name: '' })
    setListSelected(undefined)
  }

  function handleOpenListMenu(data: ListData) {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'MyLists',
      elementName: 'Opções',
      description: `Abriu menu de opções da lista "${data?.name}"`
    })

    setListSelected(data)
    listMenuBottomSheetRef?.current?.present()
  }

  function handleAddNewList() {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'MyLists',
      elementName: 'Adicionar',
      description: 'Clicou em adicionar uma nova lista'
    })

    setForceEnableDismiss(false)
    reset({ name: '' })
    setListSelected(undefined)
    formBottomSheetRef.current?.present()
  }

  function handleEditList() {
    logEvent(EVENT_TYPE.ACTION, {
      screen: 'MyLists',
      elementName: 'Editar',
      description: `Clicou em editar a lista ${listSelected!.name}`
    })
    setForceEnableDismiss(false)
    listMenuBottomSheetRef.current?.dismiss()
    reset({ name: listSelected!.name })
    formBottomSheetRef.current?.present()
  }

  async function handleNavigateToList(data: ListData) {
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

    await logEvent(EVENT_TYPE.ACTION, {
      screen: 'MyLists',
      elementName: 'Visualizar',
      description: `Clicou em visualizar itens da lista "${data.name}"`
    })

    navigation.navigate('list_item', { listId: data.id!, name: data.name })
  }

  async function handleDeleteList() {
    try {
      setDeleteLoading(true)

      await firestore().collection('lists').doc(listSelected?.id).delete()

      await logEvent(EVENT_TYPE.ACTION, {
        screen: 'MyLists',
        elementName: 'Deletar',
        description: `Deletou a lista "${listSelected?.name}"`
      })

      setListData(prevState =>
        prevState.filter(item => item.id !== listSelected?.id)
      )

      handleCloseListMenuModal()
    } catch (e) {
      Toast.show({
        visibilityTime: 2000,
        type: 'error',
        text1: 'Opss...',
        text2: 'Ocorreu um erro ao deletar a lista'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleConfirmDeleteList() {
    if (listSelected) {
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
        screen: 'MyLists',
        elementName: 'Deletar',
        description: `Clicou em deletar lista - "${listSelected.name}"`
      })

      Alert.alert(
        'Confirmação',
        `Deseja realmente remover "${listSelected.name}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          { text: 'Confirmar', onPress: handleDeleteList }
        ]
      )
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <S.HeaderIconButton onPress={handleAddNewList}>
          <MaterialIcons
            name="playlist-add"
            size={24}
            color={theme.colors.white}
          />
        </S.HeaderIconButton>
      )
    })
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      try {
        setLoading(true)

        logEvent(EVENT_TYPE.PAGE_VIEW, {
          screen: 'MyLists'
        })

        const unsubscribe = firestore()
          .collection('lists')
          .where('user_id', '==', user?.id)
          .orderBy('created_at', 'asc')
          .onSnapshot(response => {
            if (response) {
              const listFormatted = response.docs.map(doc => {
                const data = doc.data()

                const createdAt = new Date(data.created_at.toDate())
                const updatedAt = new Date(data.updated_at.toDate())

                const items = data.items as ListItemData[]

                const done = items.filter(item => item.status === 'done').length
                const total = items.length

                return {
                  id: doc.id,
                  ...data,
                  created_at: createdAt,
                  updated_at: updatedAt,
                  done,
                  total
                } as ListDataProps
              })

              setListData(listFormatted)
            }

            setLoading(false)
          })

        return () => unsubscribe()
      } catch {
        setLoading(false)
        Toast.show({
          visibilityTime: 4000,
          type: 'error',
          text1: 'Opss...',
          text2:
            'Ocorreu um erro ao carregar os dados, tente novamente mais tarde.'
        })
      }
    }, [navigation, user?.id, netInfo.isConnected])
  )

  return (
    <S.Wrapper>
      {!netInfo.isConnected ? (
        <Disconnected />
      ) : loading ? (
        <LoadingScreen />
      ) : listData.length <= 0 ? (
        <Empty
          description="Você ainda não tem nenhuma lista cadastrada ainda!"
          actionDescription="Criar lista"
          onPress={handleAddNewList}
        />
      ) : (
        <S.ListWrapper>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={listData}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Button
                variant="ghost"
                onPress={() => handleNavigateToList(item)}
                disabled={loading}
              >
                <S.Item>
                  <S.TitleWrapper>
                    <Text fontFamily="robotoBold" size={20} mb={4}>
                      {item.name}
                    </Text>

                    <Button
                      variant="ghost"
                      onPress={() => handleOpenListMenu(item)}
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={24}
                        color={theme.colors.gray_200}
                      />
                    </Button>
                  </S.TitleWrapper>

                  <ProgressBar
                    itemsCount={item.done}
                    itemsTotal={item.total}
                    showItemsText
                  />
                </S.Item>
              </Button>
            )}
          />
        </S.ListWrapper>
      )}

      {/* FORM */}
      <BottomModalWrapper
        ref={formBottomSheetRef}
        snapPoints={formSnapPoints}
        title={`${listSelected ? 'Editar lista' : 'Criar uma nova lista'}`}
        onClose={handleCloseFormModal}
        onDismiss={handleCloseFormModal}
        forceEnableDismiss={forceEnableDismiss}
      >
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome da lista"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
              mb={16}
            />
          )}
        />

        <Button onPress={handleSubmit(onSaveList)} loading={formLoading}>
          <Text fontFamily="robotoBold">SALVAR</Text>
        </Button>
      </BottomModalWrapper>

      {/* MENU OPCOES */}

      <BottomModalWrapper
        ref={listMenuBottomSheetRef}
        snapPoints={listMenuSnapPoints}
        title={listSelected?.name || ''}
        onClose={handleCloseListMenuModal}
        onDismiss={handleCloseListMenuModal}
      >
        <S.MenuItem
          variant="ghost"
          mt={18}
          onPress={handleEditList}
          disabled={deleteLoading}
        >
          <MaterialCommunityIcons
            name="playlist-edit"
            size={28}
            color={theme.colors.gray_200}
          />
          <Text fontFamily="robotoBold" color="gray_100">
            Editar
          </Text>
        </S.MenuItem>

        <S.MenuItem
          variant="ghost"
          mt={28}
          onPress={handleConfirmDeleteList}
          disabled={deleteLoading}
        >
          <FontAwesome name="trash-o" size={22} color={theme.colors.red_600} />
          <Text fontFamily="robotoBold" color="red_600" ml={10}>
            {deleteLoading ? 'Deletando...' : 'Deletar'}
          </Text>
        </S.MenuItem>
      </BottomModalWrapper>
    </S.Wrapper>
  )
}
