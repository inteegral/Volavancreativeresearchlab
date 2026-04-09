import { Studio } from 'sanity'
import sanityConfig from '../../../sanity.config'

export default function StudioPage() {
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={sanityConfig} />
    </div>
  )
}
