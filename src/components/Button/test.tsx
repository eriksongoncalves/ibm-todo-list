import { render, fireEvent } from '@utils/test-utils'

import { Text } from '../Text'
import { Button } from './'

const mockFn = jest.fn()

describe('Button component', () => {
  it('should be rendered with default variant', () => {
    const { getByTestId } = render(
      <Button onPress={mockFn} testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')

    expect(buttonComponent.props.style.borderWidth).toBe(1)
    expect(buttonComponent.props.style.borderColor).toBe('#00875f')
    expect(buttonComponent.props.style.borderStyle).toBe('solid')
    expect(buttonComponent.props.style.backgroundColor).toBe('#00875f')
  })

  it('should be rendered with outline variant', () => {
    const { getByTestId } = render(
      <Button variant="outline" testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')
    expect(buttonComponent.props.style.borderWidth).toBe(1)
    expect(buttonComponent.props.style.borderColor).toBe('#00b37e')
    expect(buttonComponent.props.style.borderStyle).toBe('solid')
    expect(buttonComponent.props.style.backgroundColor).not.toBeDefined()
  })

  it('should be rendered with ghost variant', () => {
    const { getByTestId } = render(
      <Button variant="ghost" testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')

    expect(buttonComponent.props.style.borderWidth).not.toBeDefined()
    expect(buttonComponent.props.style.borderColor).not.toBeDefined()
    expect(buttonComponent.props.style.borderStyle).not.toBeDefined()
    expect(buttonComponent.props.style.backgroundColor).not.toBeDefined()
    expect(buttonComponent.props.style.width).toBe('auto')
    expect(buttonComponent.props.style.paddingTop).toBe(0)
    expect(buttonComponent.props.style.paddingBottom).toBe(0)
    expect(buttonComponent.props.style.paddingRight).toBe(0)
    expect(buttonComponent.props.style.paddingLeft).toBe(0)
  })

  it('should be rendered with margins', () => {
    const { getByTestId } = render(
      <Button ml={8} mb={10} mt={20} testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')

    expect(buttonComponent.props.style.marginLeft).toBe(8)
    expect(buttonComponent.props.style.marginBottom).toBe(10)
    expect(buttonComponent.props.style.marginTop).toBe(20)
  })

  it('should be rendered with loading', () => {
    const { getByTestId } = render(
      <Button loading onPress={mockFn} testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')
    const loadingComponent = getByTestId('buttonLoading')

    expect(buttonComponent.props.accessibilityState.disabled).toBe(true)
    expect(loadingComponent).toBeTruthy()

    fireEvent(buttonComponent, 'click')

    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should be able to click', () => {
    const { getByTestId } = render(
      <Button onPress={mockFn} testID="myButton">
        <Text>CLICK</Text>
      </Button>
    )

    const buttonComponent = getByTestId('myButton')

    fireEvent(buttonComponent, 'click')

    expect(mockFn).toHaveBeenCalled()
  })
})
