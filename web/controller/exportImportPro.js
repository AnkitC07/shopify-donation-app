import shopify from "../shopify.js"

export const exportProducts = async (req,res) =>{
    const session = res.locals.shopify.session;
    const products = await shopify.api.rest.Product.all({session,limit:10,since_id:req.query.since_id})
    const count = await shopify.api.rest.Product.count({session})
    const data = products.data.map(x=>{
        const dataVal = x.variants.map(v=>{
            return {title:`${x.title} ${v.title}`,product_id:x.id.toString(),variant_id:v.id.toString(),price:v.price}
        })
        return dataVal
    })
    res.status(200).json({products:data.flat(),count:count.count,productlength:products.data.length})
}