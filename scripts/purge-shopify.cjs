const {PurgeCSS} = require('purgecss')
const fs=require('fs')
async function run(){
  const cfg=require('../purgecss.config.cjs')
  const results = await new PurgeCSS().purge({...cfg, rejected:false})
  for(const r of results){
    fs.writeFileSync(r.file, r.css)
    console.log(`purged ${r.file} ${r.css.length}`)
  }
}
run().catch(e=>{console.error(e); process.exit(1)})
