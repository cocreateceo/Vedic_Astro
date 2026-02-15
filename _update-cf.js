const fs = require('fs');
const data = JSON.parse(fs.readFileSync('_cf-config.json','utf8'));
const etag = data.ETag;
const config = data.DistributionConfig;
const assocs = config.DefaultCacheBehavior.FunctionAssociations || {Quantity:0, Items:[]};
const items = assocs.Items || [];
const already = items.some(i => (i.FunctionARN||'').includes('vedic-astro-rsc-rewrite'));
if (!already) {
  items.push({
    FunctionARN: 'arn:aws:cloudfront::248825820556:function/vedic-astro-rsc-rewrite',
    EventType: 'viewer-request'
  });
}
assocs.Quantity = items.length;
assocs.Items = items;
config.DefaultCacheBehavior.FunctionAssociations = assocs;
fs.writeFileSync('_cf-config-updated.json', JSON.stringify(config));
console.log('ETag:', etag);
console.log('Functions:', items.length);
