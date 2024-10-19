import { render } from '@utils/test-utils'

import { ProgressBar } from './'

describe('ProgressBar component', () => {
  it('should be rendered correctly', () => {
    const { getByTestId } = render(<ProgressBar />)

    expect(getByTestId('progressBar')).toBeTruthy()
  })

  it('should not be rendered counts label when showItemsText prop is false', () => {
    const itemsCount = 5
    const itemsTotal = 10

    const { queryByText } = render(
      <ProgressBar itemsCount={itemsCount} itemsTotal={itemsTotal} />
    )

    expect(queryByText(`${itemsCount}/${itemsTotal}`)).toBeFalsy()
  })

  it('should be rendered counts label when showItemsText prop is true', () => {
    const itemsCount = 5
    const itemsTotal = 10

    const { getByText } = render(
      <ProgressBar
        itemsCount={itemsCount}
        itemsTotal={itemsTotal}
        showItemsText
      />
    )

    expect(getByText(`${itemsCount}/${itemsTotal}`)).toBeTruthy()
  })

  it('should be rendered with margins', () => {
    const renderResult = render(<ProgressBar mb={10} mt={20} />)

    const wrapper = renderResult.toJSON()

    expect(wrapper.props.style[0].marginTop).toBe(20)
    expect(wrapper.props.style[0].marginBottom).toBe(10)
  })
})
