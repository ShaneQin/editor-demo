import { db } from '../db'
import { liveQuery } from 'dexie'

onmessage = function (e) {
  const addDictionary = async () => {
    const keywords = [
      {
        id: 0,
        name: '开张圣听',
        text: '扩大圣明的听闻，意思是要后主广泛地听取别人的意见'
      },
      {
        id: 1,
        name: '妄自菲薄',
        text: '过分看轻自己'
      },
      {
        id: 2,
        name: '臧否',
        text: '善恶，这里形容词用作动词。意思是“评论人物的好坏”'
      },
      {
        id: 3,
        name: '内外异法',
        text: '宫内和丞相府内刑赏之法不同'
      },
      {
        id: 5,
        name: '有司',
        text: '职有专司，就是专门管理某种事情的官。'
      }
    ]
    for (let i = 0; i < keywords.length; i++) {
      const cur = keywords[i]
      try {
        await db.keywords.put(cur)
      } catch (err) {

      }
    }
    const query = await db.keywords.toArray()
    postMessage(query)
  }
  addDictionary()

}

