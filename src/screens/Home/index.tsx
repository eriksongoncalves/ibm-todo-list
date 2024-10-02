import { Text } from '@components/Text'
import { Button } from '@components/Button'

import { useAuth } from '@hooks/auth'

export function Home() {
  const { signOut, loading } = useAuth()

  return (
    <Button variant="outline" onPress={signOut} disabled={loading}>
      <Text fontFamily="robotoBold" color="green_500">
        HOME {'>>>'} LOGOUT
      </Text>
    </Button>
  )
}
