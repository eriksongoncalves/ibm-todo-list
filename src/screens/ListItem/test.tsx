/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationContext } from '@react-navigation/native'
import { render, act } from '@utils/test-utils'
import { ListItem } from './'

const navContextValue = {
  isFocused: () => true,
  addListener: jest.fn(() => jest.fn())
} as any

const mockNavigate = jest.fn()
const mockToast = jest.fn()
const mockFirestoreGet = jest.fn().mockResolvedValue({
  id: '123123',
  data: () => ({
    name: 'Lista da compras',
    user_id: 'USER_ID',
    items: [],
    created_at: {
      toDate: () => new Date()
    },
    updated_at: {
      toDate: () => new Date()
    }
  })
})

const mockNetInfo = jest.fn(() => ({ isConnected: true }))

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => mockNetInfo()
}))

jest.mock('react-native-element-dropdown', () => jest.fn())

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
        await findByText(
          /Você ainda não tem nenhum item adicionado na sua lista/i
        )
      ).toBeTruthy()
    })
    // })
  })
})
