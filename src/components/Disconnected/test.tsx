import { render } from '@utils/test-utils'

import { Disconnected } from './'

describe('Disconnected component', () => {
  it('should be rendered', () => {
    const tree = render(<Disconnected />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
