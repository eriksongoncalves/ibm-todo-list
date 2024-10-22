jest.mock('@utils/analitycs', () => {
  return {
    EVENT_TYPE: {
      PAGE_VIEW: 'TELA',
      ACTION: 'ACAO'
    },
    logEvent: jest.fn()
  }
})
