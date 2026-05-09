import Dashboard from '@/views/guest/dashboard/Dashboard'

function index() {
  const thead = [] as any
  const tbody = [] as any
  const graph = {} as any

  return (
    <Dashboard thead={thead} tbody={tbody} graph={graph} />
  )
}

export default index