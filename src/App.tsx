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
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { resetSelections } from "./data/selectionSlice"
import { OrderDetails } from "./orderDetails"
import { Summary } from "./summary"

export const App: FunctionComponent = () => {
  const selections = useAppSelector((state) => state.selections)
  const dispatch = useAppDispatch()
  const { data } = queries.useGetProductsQuery()

  const addToOrder = (p: Product, q: number) =>
    dispatch(reducers.addToOrder([p, q]))

  const categories = useMemo<string[]>(() => {
    return [...new Set(data?.map((p) => p.category))]
  }, [data])
  const [storeOrder] = reducers.useStoreOrderMutation()
  const navigate = useNavigate()
  const submitCallback = () => {
    storeOrder(selections)
      .unwrap()
      .then((id) => {
        dispatch(resetSelections())
        navigate(`/summary/${id}`)
      })
  }

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
        <Route
          path='/order'
          element={
            <OrderDetails
              selections={selections}
              submitCallback={() => submitCallback()}
            />
          }
        />
        <Route path='/summary/:id' element={<Summary />} />
        <Route path='/' element={<Navigate replace to='/products' />} />
      </Routes>
    </div>
  )
}
export default App
