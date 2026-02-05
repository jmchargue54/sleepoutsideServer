import mongodb from "../database/index.mts";
import type {FindProductObj, Product} from "./types.mts";
import { formatFields } from "../services/utils.mts";
import type { Collection, Filter } from "mongodb";


async function getAllProducts(find:FindProductObj) {
    const productsCollection:Collection<Product> = mongodb.getDb().collection<Product>('products');

    const totalCount = await productsCollection.countDocuments(find.search as Filter<Product>);

    const cursor = await productsCollection.find(find.search as Filter<Product>).skip(find.offset).limit(find.limit);

    if(find.fieldFilters) {
        cursor.project(find.fieldFilters);
    }

    const results = await cursor.toArray();
    console.log(totalCount, results);
    return {results, totalCount};
}

async function getProductById(id: string): Promise<Product | null> {
    const product = await mongodb.getDb().collection<Product>("products").findOne({id: id});
    return product;
}

// don't forget to export the function
export default {
    getAllProducts,
    getProductById
}



