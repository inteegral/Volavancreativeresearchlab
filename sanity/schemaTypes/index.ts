import { blockContent } from './objects/blockContent'
import { home } from './singletons/home'
import { about } from './singletons/about'
import { settings } from './singletons/settings'
import { programsPage } from './singletons/programsPage'
import { artist } from './documents/artist'
import { residency } from './documents/residency'
import { residencyProgram } from './documents/residencyProgram'
import { journal } from './documents/journal'
import { retreatBooking } from './documents/retreatBooking'
import { location } from './documents/location'

export const schemaTypes = [
  // Objects
  blockContent,
  // Singletons
  home,
  about,
  settings,
  programsPage,
  // Documents
  artist,
  residencyProgram,
  residency,
  journal,
  retreatBooking,
  location,
]
