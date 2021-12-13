import Dexie from 'dexie'

export const db = new Dexie('monkey')
db.version(1).stores({
  keywords: 'id, name, text'
})
