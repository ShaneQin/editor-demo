<template>
  <div>
    <div v-if="html" v-html="html"></div>
    <div v-else>{{ article }}</div>
    <button @click="handleClick">检查</button>
  </div>
</template>

<script>
import Typo from 'typo-js'

export default {
  name: 'SpellCheck',
  data() {
    return {
      dictionary: null,
      regExp: /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]|\s/,
      article: `Therea are moments in life when you miss someone so much that you just want to pick them from your dreams and hug them for real! Dream what you want to dream;go where you want to go;be what you want to be,because you have only one life and one chance to do all the things you want to do.

　　May you have enough happiness to make you sweet,enough trials to make you strong,enough sorrow to keep you human,enough hope to make you happy? Always put yourself in others’shoes.If you feel that it hurts you,it probably hurts the other person, too.

　　The happiest of people don’t necessarily have the best of everything;they just make the most of everything that comes along their way.Happiness lies for those who cry,those who hurt, those who have searched,and those who have tried,for only they can appreciate the importance of people

　　who have touched their lives.Love begins with a smile,grows with a kiss and ends with a tear.The brightest future will always be based on a forgotten past, you can’t go on well in lifeuntil you let go of your past failures and heartaches.

　　When you were born,you were crying and everyone around you was smiling.Live your life so that when you die,you're the one who is smiling and everyone around you is crying.

　　Please send this message to those people who meoan something to you,to those who have touched your life in one way or another,to those who make you smile when you really need it,to those that make you see the brighter side of things when you are really down,to those who you want to let them know that you appreciate their friendship.And if you don’t, don’t worry,nothing bad will happen to you,you will just miss out on the opportunity to brighten someone’s day with this message.`,
      html: ''
    }
  },
  methods: {
    handleClick() {
      if (!this.dictionary) {
        this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/dictionaries' })
      }
      const len = this.article.length
      let result = ''
      let i = 0
      let j = 0
      while (j < len) {
        if (this.regExp.test(this.article[j])) {
          const cur = this.article.substring(i, j)
          const correct = this.dictionary.check(cur)
          if (correct) {
            result += cur
          } else {
            result += `<span class="highlight">${cur}</span>`
          }
          while (this.regExp.test(this.article[j])) {

            result += this.article[j]
            j++
          }
          i = j
        } else {
          j++
        }
      }
      this.html = result
    }
  },
}
</script>

<style scoped>
.highlight {
  background: orangered;
}
</style>
