/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationContext } from '@react-navigation/native'
import { render, act } from '@utils/test-utils'
import { ListItem } from './'

const navContextValue = {
  isFocused: () => true,
  addListener: jest.fn(() => jest.fn())
} as any

const listDataWithoutItems = {
  name: 'Lista da compras',
  user_id: 'USER_ID',
  items: [],
  created_at: {
    toDate: () => new Date()
  },
  updated_at: {
    toDate: () => new Date()
  }
}

const listDataWithItems = {
  ...listDataWithoutItems,
  items: [
    {
      id: '1',
      description: 'Item 1',
      status: 'done',
      comments: 'teste',
      created_at: {
        toDate: () => new Date()
      },
      updated_at: {
        toDate: () => new Date()
      }
    },
    {
      id: '2',
      description: 'Item 2',
      status: 'pending',
      comments: '',
      created_at: {
        toDate: () => new Date()
      },
      updated_at: {
        toDate: () => new Date()
      }
    }
  ]
}

const mockNavigate = jest.fn()
const mockToast = jest.fn()
const mockFirestoreGet = jest.fn().mockImplementation(() =>
  Promise.resolve({
    id: '123123',
    data: () => listDataWithoutItems
  })
)

const mockNetInfo = jest.fn(() => ({ isConnected: true }))

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => mockNetInfo()
}))

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection: (table: string) => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      doc: (id: string) => ({
        get: mockFirestoreGet,
        update: () => {}
      })
    })
  })
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: () => mockNavigate(),
    dispatch: () => {},
    setOptions: () => {}
  }),
  useRoute: () => ({
    params: {
      listId: '123456',
      name: 'Lista de compras'
    }
  })
}))

jest.mock('react-native-toast-message', () => {
  return {
    show: (props: any) => mockToast(props)
  }
})

describe('ListItem screen', () => {
  it('should be rendered correctly', async () => {
    const { getByTestId, findByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <ListItem />
      </NavigationContext.Provider>
    )

    expect(getByTestId('loadingScreen')).toBeTruthy()

    await act(async () => {
      expect(
        await findByText(/Você não tem nenhum item adicionado na sua lista/i)
      ).toBeTruthy()
    })
  })

  it('should show a message when there is no internet', async () => {
    mockNetInfo.mockReturnValue({ isConnected: false })

    const { findByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <ListItem />
      </NavigationContext.Provider>
    )

    await act(async () => {
      expect(
        await findByText(
          /Parece que você está sem internet, conecte-se para continuar/i
        )
      ).toBeTruthy()
    })
  })

  it('should show 2 items on screen', async () => {
    mockNetInfo.mockReturnValue({ isConnected: true })

    mockFirestoreGet.mockResolvedValue({
      id: '123123',
      data: () => listDataWithItems
    })

    const { findAllByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <ListItem />
      </NavigationContext.Provider>
    )

    await act(async () => {
      expect(await findAllByText(/Item /i)).toHaveLength(2)
    })
  })
})
