import { fireEvent, render } from '@utils/test-utils'
import { Text } from 'react-native'

import { BottomModalWrapper } from './'

const mockFn = jest.fn()

describe('BottomModalWrapper component', () => {
  it('should be rendered', () => {
    const { getByText, getByTestId } = render(
      <BottomModalWrapper onClose={mockFn} forceEnableDismiss>
        <Text>CHILDREN</Text>
      </BottomModalWrapper>
    )

    expect(getByText(/children/i)).toBeTruthy()

    fireEvent.press(getByTestId('bottomSheetModalClose'))

    expect(mockFn).toHaveBeenCalled()
  })
})
