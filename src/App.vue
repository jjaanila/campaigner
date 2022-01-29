<template>
  <main :style="{ background: `url(${require('./img/paper.jpg')})` }">
    <page>
      <campaign-title name="Pohjola" />
      <part-title name="Background" />
      <chapter-title name="Prologue" />
      This campaign takes your party to Pohjola, a barren northern region based on Finnish mythology and folk lore. The
      campaign plays on DnD 5th Edition rules, and it introduces some new enemies, spells and items. The main
      inspiration for this work comes from the Finnish national epic Kalevala, composed by Elias Lönnrot, and Martti
      Haavio's studies of Finnish mythology. The story lines are partly or completely fictional and do not depict the
      original stories of Finnish folk lore. Some of the ideas have been loaned from the old stories, poems and songs
      philologists have recorded from singers and sages of the past. My intent was to paint a picture of this long gone
      world while stretching its stories and contexts a bit, just to make things more interesting. I'm not an expert of
      Finnish mythology, but just an engineer who recently started DnD and enjoyed it so much that decided to write his
      own story. This document contains real charms and spell poems that have been passed on through generations. Use
      them with great care and caution. Please also note that some of the symbols in this story are used by Finnish
      neo-nazis and other hate groups as "their" symbols. I don't want anything to do with these groups and I respect
      all people despite their religion, gender, color, or any other property. Hateful people also, because I believe
      they will come to their senses some day.
      <part-title name="Story begins" />
      <chapter-title name="Middle" />
      <part-title name="Story ends" />
      <chapter-title name="End" />
    </page>
  </main>
</template>

<script>
import 'normalize.css'
export default {
  name: 'app',
  data() {
    return {}
  },
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
main {
  width: 100%;
  height: 100%;
  padding: 4rem;
}
</style>
