import React, { FunctionComponent, useMemo } from "react"
import {
  Product,
  ProductSelection,
  ProductSelectionMutations,
} from "./data/entities"
import { ProductList } from "./productList"
import {
  queries,
  reducers,
  useAppDispatch,
  useAppSelector,
} from "./data/dataStore"
import { Navigate, Route, Routes } from "react-router-dom"
// let testData: Product[] = [1, 2, 3, 4, 5].map((num) => ({
//   id: num,
//   name: `Prod${num}`,
//   category: `Cat${num % 2}`,
//   description: `Product ${num}`,
//   price: 100,
// }))
export const App: FunctionComponent = () => {
  const selections = useAppSelector((state) => state.selections)
  const dispatch = useAppDispatch()
  const { data } = queries.useGetProductsQuery()

  const addToOrder = (p: Product, q: number) =>
    dispatch(reducers.addToOrder([p, q]))

  const categories = useMemo<string[]>(() => {
    return [...new Set(data?.map((p) => p.category))]
  }, [data])

  return (
    <div className='App'>
      <Routes>
        <Route
          path='/products'
          element={
            <ProductList
              products={data ?? []}
              categories={categories}
              selections={selections}
              addToOrder={addToOrder}
            />
          }
        />
        <Route path='/' element={<Navigate replace to='/products' />} />
      </Routes>
    </div>
  )
}
export default App
