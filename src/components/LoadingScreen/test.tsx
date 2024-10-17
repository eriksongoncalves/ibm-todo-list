import { render } from '@utils/test-utils'

import { LoadingScreen } from './'

describe('LoadingScreen component', () => {
  it('should be rendered', () => {
    const tree = render(<LoadingScreen />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
