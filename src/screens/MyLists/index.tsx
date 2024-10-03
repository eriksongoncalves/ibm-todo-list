import { useRef, useMemo, useEffect, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome
} from '@expo/vector-icons'

import { ProgressBar } from '@components/ProgressBar'
import { Text } from '@components/Text'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { BottomModalWrapper } from '@components/BottomModalWrapper'

import * as S from './styles'
import { ListFormData, listFormResolver } from './validationSchema'

const listsMock = [
  {
    id: '1',
    name: 'Lista 1',
    done: 16,
    total: 16
  },
  {
    id: '2',
    name: 'Lista 2',
    done: 28,
    total: 36
  }
]

type ListData = {
  id?: string
  name: string
}

export function MyLists() {
  const navigation = useNavigation()
  const theme = useTheme()
  const formBottomSheetRef = useRef<BottomSheetModal>(null)
  const listMenuBottomSheetRef = useRef<BottomSheetModal>(null)
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
  const [listData, setListData] = useState<ListData>()

  const formSnapPoints = useMemo(() => [290], [])
  const listMenuSnapPoints = useMemo(() => [270], [])

  function onSaveList(data: ListFormData) {
    console.log('>>> data', data)
  }

  function handleCloseListMenuModal() {
    listMenuBottomSheetRef?.current?.dismiss()
  }

  function handleCloseFormModal() {
    formBottomSheetRef.current?.dismiss()
    reset({ name: '' })
    setListData(undefined)
  }

  function handleOpenListMenu(data: ListData) {
    setListData(data)
    listMenuBottomSheetRef?.current?.present()
  }

  function handleAddNewList() {
    reset({ name: '' })
    setListData(undefined)
    formBottomSheetRef.current?.present()
  }

  function handleEditList() {
    listMenuBottomSheetRef.current?.dismiss()
    reset({ name: listData!.name })
    formBottomSheetRef.current?.present()
  }

  function handleNavigateToList(listId: string) {
    navigation.navigate('list_detail', { listId })
  }

  function handleDeleteList() {
    if (listData) {
      Alert.alert(
        'Confirmação',
        `Deseja realmente remover "${listData.name}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          { text: 'Confirmar', onPress: () => console.log('Confirm Pressed') }
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

  if (listsMock.length <= 0) {
    return (
      <S.Wrapper>
        <S.EmptyWrapper>
          <MaterialIcons
            name="filter-list-off"
            size={90}
            color={theme.colors.gray_500}
          />

          <Text align="center" size={20} color="gray_300">
            Você ainda não tem nenhuma lista cadastrada ainda!
          </Text>
          <Button variant="ghost" onPress={handleAddNewList}>
            <Text fontFamily="robotoBold" color="green_500" size={20}>
              Criar lista
            </Text>
          </Button>
        </S.EmptyWrapper>
      </S.Wrapper>
    )
  }

  return (
    <S.Wrapper>
      <S.ListWrapper>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={listsMock}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Button
              variant="ghost"
              onPress={() => handleNavigateToList(item.id)}
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

      {/* FORM */}
      <BottomModalWrapper
        ref={formBottomSheetRef}
        snapPoints={formSnapPoints}
        title={`${listData?.id ? 'Editar lista' : 'Criar uma nova lista'}`}
        onClose={handleCloseFormModal}
        onDismiss={handleCloseFormModal}
        hasForm
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

        <Button onPress={handleSubmit(onSaveList)}>
          <Text fontFamily="robotoBold">SALVAR</Text>
        </Button>
      </BottomModalWrapper>

      {/* MENU OPCOES */}

      <BottomModalWrapper
        ref={listMenuBottomSheetRef}
        snapPoints={listMenuSnapPoints}
        title={listData?.name || ''}
        onClose={handleCloseListMenuModal}
        onDismiss={handleCloseListMenuModal}
      >
        <S.MenuItem variant="ghost" mt={18} onPress={handleEditList}>
          <MaterialCommunityIcons
            name="playlist-edit"
            size={28}
            color={theme.colors.gray_200}
          />
          <Text fontFamily="robotoBold" color="gray_100">
            Editar
          </Text>
        </S.MenuItem>

        <S.MenuItem variant="ghost" mt={28} onPress={handleDeleteList}>
          <FontAwesome name="trash-o" size={22} color={theme.colors.red_600} />
          <Text fontFamily="robotoBold" color="red_600" ml={10}>
            Deletar
          </Text>
        </S.MenuItem>
      </BottomModalWrapper>
    </S.Wrapper>
  )
}
