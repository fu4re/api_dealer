import React, { useState, useMemo, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import size from 'lodash/size'
import reduce from 'lodash/reduce'
import toLower from 'lodash/toLower'
import upperFirst from 'lodash/upperFirst'
import Input from 'components/inputs/input/Input'
import Text from 'components/base/text/Text'
import Categories from 'components/base/categories/Categories'
import Row from 'components/base/row/Row'
import Button from 'components/base/button/Button'
import CarCard from 'components/cards/car/CarCard'
import LoadingCar from 'components/cards/car/LoadingCar'
import LoadErrorNotice from 'components/base/notice/LoadErrorNotice'
import Confirm from 'components/base/confirm/Confirm'
import NotFoundNotice from 'components/base/notice/NotFoundNotice'
import NoItemsCard from 'components/cards/no-items/NoItemsCard'
import BackButton from 'components/buttons/back/BackButton'
import { ROUTER_PATHS } from 'constants/router'
import { INPUT_TYPES } from 'components/inputs/input/Input'
import { getCars } from 'network/requests'
import type { CarType } from 'components/cards/car/CarCard'
import type { HttpResponseError } from 'network/HttpClient'
import './cars.scss'

export type CarsListProps = {
  onClick?: (data: Record<string, any>) => void,
  className?: string,
}

const CarsList = (props: CarsListProps) => {
  const { onClick, className = '' } = props

  const [cars, setCars] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCarId, setSelectedCarId] = useState(null)

  const searchedCars = useMemo(
    () =>
      (cars || []).filter(({ title }) => toLower(title).indexOf(toLower(search)) !== -1),
    [cars, search],
  )

  useEffect(() => {
    getCars()
      .then(({ responseData: data }: Record<string, any>) => {
        setCars(data)
        setTimeout(() => setIsFetching(false), 1000)
      })
      .catch((error: HttpResponseError) => {
        Confirm.showError({ message: 'При загрузке автомобилей произошла ошибка', error })
        console.warn(error)
        setIsFetching(false)
      })
  }, [])

  const filteredItems = useMemo(
    () =>
      reduce(
        searchedCars,
        (acc, value) => {
          const filter = value.brand

          const values = acc[filter]
          acc[filter] = size(values) > 0 ? [...values, value] : [value]

          return acc
        },
        {},
      ),
    [searchedCars],
  )

  const categories = useMemo(
    () =>
      Object.keys(filteredItems)
        .slice(0)
        .sort()
        .map((id) => ({ id, text: upperFirst(id), count: size(filteredItems[id]) })),
    [filteredItems],
  )

  const [category, setCategory] = useState(categories[0]?.id)

  useEffect(() => {
    setCategory(categories[0]?.id)
  }, [categories])

  const onSelectCategory = useCallback((id: string) => setCategory(id), [setCategory])

  const onChangeSearch = useCallback(
    ({ value }: InputCallbackData) => setSearch(value),
    [setSearch],
  )

  const onResetSearch = useCallback(() => setSearch(''), [setSearch])

  const searchInput = useMemo(
    () => (
      <Input
        type={INPUT_TYPES.text}
        placeholder="Введите название автомобиля"
        hasVisiblePlaceholder
        className="cars__search"
        val={search}
        onChange={onChangeSearch}
        onReset={onResetSearch}
      />
    ),
    [search, onChangeSearch, onResetSearch],
  )

  const categoriesContent = useMemo(
    () => (
      <Categories
        items={categories}
        activeId={category}
        onClickCategory={onSelectCategory}
      />
    ),
    [categories, category, onSelectCategory],
  )

  const collection = useMemo(() => {
    const keys = Object.keys(filteredItems || {})

    if (isFetching) {
      return (
        <div className="cars-collection">
          <div className="cars__content">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <LoadingCar key={index} />
              ))}
          </div>
        </div>
      )
    }

    if (size(search) > 0 && size(keys) === 0) {
      return <NotFoundNotice />
    }

    return (
      <div className="cars-collection">
        {Object.keys(filteredItems || {})?.map((i) => (
          <div
            key={i}
            className={classNames('cars__content', i === category ? 'show' : 'hide')}
          >
            {filteredItems[i].map((item: CarType) => (
              <CarCard
                key={item.id}
                {...item}
                isActive={item.id === selectedCarId}
                onClick={setSelectedCarId}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }, [filteredItems, search, category, isFetching, selectedCarId, setSelectedCarId])

  const onClickNext = useCallback(() => {
    if (selectedCarId === null) {
      return
    }

    const selectedCar = (cars || []).find(({ id }) => id === selectedCarId)
    onClick?.({ car: selectedCar, firstStep: true })
  }, [selectedCarId, cars, onClick])

  const buttons = useMemo(() => {
    const hasError = !isFetching && cars === null

    return (
      <Row className="cars__buttons" horizontal={hasError ? 'center' : undefined}>
        <BackButton likeButton path={ROUTER_PATHS.CRM} />
        {!hasError && (
          <Button text="Далее" disabled={selectedCarId === null} onClick={onClickNext} />
        )}
      </Row>
    )
  }, [selectedCarId, isFetching, cars, onClickNext])

  const content = useMemo(() => {
    if (isFetching) {
      return collection
    }

    if (cars === null) {
      return (
        <>
          <LoadErrorNotice />
          {buttons}
        </>
      )
    }

    if (Array.isArray(cars) && size(cars) === 0 && size(search) === 0) {
      return <NoItemsCard title="Пока нет автомобилей" />
    }

    return (
      <>
        {searchInput}
        {categoriesContent}
        {collection}
        {buttons}
      </>
    )
  }, [isFetching, cars, search, searchInput, categoriesContent, buttons, collection])

  return (
    <div className={classNames('cars', className)}>
      <Text variant="lg" className="cars__title">
        {'Выберите автомобиль'}
      </Text>
      {content}
    </div>
  )
}

export default CarsList
