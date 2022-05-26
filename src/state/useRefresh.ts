import { useContext } from 'react'
import { RefreshContext } from 'src/contexts/RefreshContext'

const useRefresh = () => {
  const { fast, slow, triggerRefresh } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, triggerRefresh }
}

export default useRefresh