import { render } from '@utils/test-utils'

import { Text } from './'

describe('Text component', () => {
  it('should be rendered with default props', () => {
    const { getByText } = render(<Text>SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].fontSize).toBe(16)
    expect(textComponent.props.style[0].fontFamily).toBe('Roboto_400Regular')
    expect(textComponent.props.style[0].color).toBe('#e1e1e6')
    expect(textComponent.props.style[0].textAlign).toBe('left')
    expect(textComponent.props.style[0].textTransform).toBe('none')
  })

  it('should be rendered with a different font size', () => {
    const { getByText } = render(<Text size={18}>SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].fontSize).toBe(18)
  })

  it('should be rendered with a different font family', () => {
    const { getByText } = render(<Text fontFamily="robotoBold">SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].fontFamily).toBe('Roboto_700Bold')
  })

  it('should be rendered with a different color', () => {
    const { getByText } = render(<Text color="green_500">SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].color).toBe('#00b37e')
  })

  it('should be rendered with text centered', () => {
    const { getByText } = render(<Text align="center">SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].textAlign).toBe('center')
  })

  it('should be rendered with a different text transform', () => {
    const { getByText } = render(<Text trasnform="uppercase">SOME TEXT</Text>)

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].textTransform).toBe('uppercase')
  })

  it('should be rendered with margins', () => {
    const { getByText } = render(
      <Text ml={8} mb={10} mt={20}>
        SOME TEXT
      </Text>
    )

    const textComponent = getByText('SOME TEXT')

    expect(textComponent.props.style[0].marginLeft).toBe(8)
    expect(textComponent.props.style[0].marginBottom).toBe(10)
    expect(textComponent.props.style[0].marginTop).toBe(20)
  })
})
