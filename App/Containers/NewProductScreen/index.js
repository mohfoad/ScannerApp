import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated, Keyboard } from 'react-native'
import { pathOr } from 'ramda'
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'
import Accordion from 'react-native-collapsible/Accordion'
import Button from '../../Components/Button'
import Pill from '../../Components/Pill'
import { Metrics, Colors, Images } from '../../Themes'
import { keyboardDidShow, keyboardDidHide } from '../../Lib/ComponentEventHandlers'

import { get as _get } from 'lodash'
import * as Animatable from 'react-native-animatable'
import Autocomplete from 'react-native-autocomplete-input'

import { createImageProgress } from 'react-native-image-progress'
import ProgressCircle from 'react-native-progress/Circle'

// React Apollo
import { graphql } from 'react-apollo/index'
import { compose, withPropsOnChange } from 'recompose'
import { withAuth, withBrandCreate } from '../../GraphQL/Account/decorators'
import { withProductCreate, withProductUpdate } from '../../GraphQL/Shared/decorators'
import * as sharedQueries from '../../GraphQL/Shared/queries'

// Styles
import Styles from '../Styles/NewProductScreenStyles'

const photoStep = 1
const categoryStep = 2
const subcategoryStep = 3
const brandStep = 4

const brandPlaceholder = 'Enter the Brand Name'

const ProgressImage = createImageProgress(Animatable.Image)
const progressIndicatorProps = {
  size: 20,
  indeterminate: true,
  color: Colors.secondary,
  borderWidth: 2
}

const SECTIONS = [
  {
    title: '1. PHOTOS',
    step: photoStep,
    cta: `Take a photo of each side of the product. Ready?`,
    description: ``
  },
  {
    title: '2. CATEGORY',
    step: categoryStep,
    cta: `Select a category`,
    description: `Choose the category that this product belongs to. NOTE: The category and subcategory you last capture have been selected by default.`
  },
  {
    title: '3. SUBCATEGORY',
    step: subcategoryStep,
    cta: `Select a subcategory`,
    description: `Choose the subcategory that this product belongs to. NOTE: The category and subcategory you last capture have been selected by default.`
  },
  {
    title: '4. SELECT BRAND',
    step: brandStep,
    cta: `Select Brand`,
    description: `Type to enter the brand`
  }
]

class Index extends React.Component {
  constructor (props) {
    super(props)

    const topology = pathOr({ category: null, subCategory: null }, ['product', 'topology', 0], this.props)
    const brand = pathOr({ _id: null, name: null }, ['product', 'brand'], this.props)

    let selectedPills = []

    selectedPills[categoryStep] = props.topology.category || topology.category
    selectedPills[subcategoryStep] = props.topology.subCategory || topology.subCategory

    const brandName = pathOr(false, ['topology', 'brand', 'name'], props)
    const brandId = pathOr(false, ['topology', 'brand', '_id'], props)
    selectedPills[brandStep] = brandName || brand.name

    this.state = {
      heightAnimation: new Animated.Value(Metrics.screenHeight - Metrics.breadcrumbHeight),
      currentStep: 1,
      selectedPills,
      brandQuery: brandName || brand.name || '',
      brand: {
        _id: brandId || brand._id,
        name: brandName || brand.name
      },
      visibleHeight: Metrics.screenHeight,
      loading: false,
      canNavigate: true,
      keyboardOffset: 25
    }
  }

  handleNextStep = () => {
    // only go next if step is complete
    const { currentStep, selectedPills, brand } = this.state
    const { photos, categories } = this.props

    if (currentStep === photoStep && photos.length < 2) {
      // we moved on from photos prompt, so take them to the camera screen
      this.handleGoToCamera()
    } else if (selectedPills[currentStep] || (currentStep >= 4 && brand.name && brand.name !== brandPlaceholder)) {
      // make sure the selected subcategory is in the current category (can be different if the user hops around)
      if (
        currentStep !== subcategoryStep ||
        (currentStep === subcategoryStep &&
          !!categories[selectedPills[categoryStep]].find(
            (subcategory) => subcategory === selectedPills[subcategoryStep]
          ))
      ) {
        this.setState({ currentStep: currentStep + 1 }, () => {
          if (this.state.currentStep >= 7) {
            // six is the last step after confirming once -- so if we're at 7 now, proceed onward to creation
            this.handleCreateNewProduct()
          }
          if (this.state.currentStep === brandStep) {
            this.forceBrandListRerender()
          }
        })
      }
    }
  };

  handleCreateNewProduct = async () => {
    try {
      const {
        barcode,
        uploadedRemoteMedia,
        photos,
        product,
        shouldUpdate,
        productCreate,
        brandCreate,
        productUpdate,
        brands
      } = this.props
      const category = this.state.selectedPills[categoryStep]
      const subCategory = this.state.selectedPills[subcategoryStep]

      // check each photo in photos and if its a remote image (i.e. has a protocol http(s?)://):
      //    find the oid in the products mediaList
      // else:
      //    find the oid based on the localPath: key value that matches
      //    the photos path in  each uploadedRemoteMedia's objects
      const mediaList = photos
        .map((path) => {
          if (/^https?:\/\//i.test(path)) {
            console.log('path is remote', path)
            const media = pathOr([], ['mediaList'], product).find((item) => item.source === path)
            return media._id
          } else {
            console.log('path is local', path)
            const media = uploadedRemoteMedia.find((item) => item.localPath === path)
            if (media && media._id) {
              return media._id
            }
          }
        })
        .filter((exists) => exists)

      this.setState({ loading: true }, async () => {
        let brandId
        const brand = this.state.brand
        const foundBrand = brands.find((brand) => brand.name === this.state.brandQuery)

        if (brand._id || foundBrand) {
          console.log('found brand or have id')
          brandId = foundBrand ? foundBrand._id : brand._id
        } else {
          // make brand if need to
          console.log('making brand')
          let resp = await brandCreate({
            variables: {
              data: {
                name: brand.name
              }
            }
          })
          brandId = resp.data.brandCreate._id
        }

        const createOrUpdate = shouldUpdate ? productUpdate.bind(this) : productCreate.bind(this)
        const idOrNothing = shouldUpdate ? { _id: product._id } : {}

        const variables = {
          ...idOrNothing,
          ...{
            data: {
              name: `NO NAME - ${barcode}`,
              upc: [barcode],
              topology: [{ category, subCategory }],
              image: mediaList[0],
              mediaList,
              brand: brandId
            }
          }
        }

        await createOrUpdate({
          variables
        })

        // save current topology for the next product
        this.props.setApplicationData('topology', { category, subCategory, brand: { _id: brandId, name: brand.name } })
        this.setState({ loading: false })
        const msg = shouldUpdate ? `Product updated` : `Product created`
        const title = shouldUpdate ? `Update product` : `New product`
        this.props.populateAlert(msg, 'success', title)
        this.props.handleNextStep(this.state)
      })
    } catch (e) {
      // @TODO: handle error case
      console.log(e)
      this.setState({ loading: false })
      const msg = `Error creating product`
      this.props.populateAlert(msg, 'error')
    }
  };

  componentDidMount () {
    this.props.searchBrands(this.state.brand.name)
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))
    this.keyboardDidHideScrollBackListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHideScrollBack
    )
    this.keyboardDidShowListener2 = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShowScroll)
    Keyboard.dismiss()
  }

  handleKeyboardDidHideScrollBack = () => {
    this.setState({ keyboardOffset: 25 })
    this.scrollView.scrollTo(
      {
        y: 0,
        animated: true
      },
      this.forceUpdate
    )
  };

  handleKeyboardDidShowScroll = () => {
    this.setState({ keyboardOffset: 200 })
    this.scrollView.scrollTo(
      {
        y: this.state.visibleHeight / 2,
        animated: true
      },
      this.forceUpdate
    )
  };

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    this.keyboardDidHideScrollBackListener.remove()
    this.keyboardDidShowListener2.remove()
    this.props.resetApplicationData()
  }

  componentWillReceiveProps (newProps) {
    const { isFocused, photos } = newProps

    if (this.props.isFocused !== true && isFocused === true && photos.length >= 2) {
      this.setState({
        currentStep: this.state.currentStep + 1,
        canNavigate: true
      })
    } else if (this.props.isFocused !== true && isFocused === true) {
      this.setState({
        canNavigate: true
      })
    }
  }

  renderAccordionHeader = (section, index, isActive) => {
    const { currentStep, selectedPills } = this.state

    return (
      <Animatable.View style={Styles.accordionHeading(isActive)} duration={300} transition={`height`}>
        <Animatable.Text
          style={[Styles.headingText, { opacity: isActive ? 0 : 1 }]}
          duration={300}
          useNativeDriver
          transition={`opacity`}
        >
          {section.title}
        </Animatable.Text>
        <Animatable.Image
          transition={`opacity`}
          duration={300}
          delay={300}
          source={Images.greenCheckmark}
          style={[Styles.greenCheckmark, { opacity: section.step >= currentStep ? 0 : 1 }]}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={Styles.selectedPillsContentWrapper}
          contentContainerStyle={Styles.selectedPillsContent(section.step)}
        >
          <Animatable.View
            style={[{ opacity: 1 }]}
            duration={200}
            delay={section.step >= currentStep ? 100 * (5 - section.step) : 400}
            transition={`opacity`}
          >
            {section.step === 1 && this.props.photos.length > 0 ? (
              this.renderPhotos(section, true)
            ) : (
              <Pill
                text={selectedPills[section.step]}
                style={Styles.selectedPill}
                textStyle={Styles.selectedPillText}
                isSelected
                onPress={this.accordionHeaderChange.bind(this, section.step - 1)}
              />
            )}
          </Animatable.View>
        </ScrollView>
      </Animatable.View>
    )
  };

  renderAccordionContent = (section, index, isActive) => {
    const { brands } = this.props
    return (
      <Animatable.View
        style={[Styles.accordionContent(section.step, brands.length > 0), { opacity: isActive ? 1 : 0 }]}
        duration={600}
        useNativeDriver
        transition={['opacity']}
      >
        <Text style={Styles.contentStepText}>STEP {section.step}:</Text>
        <Text style={Styles.contentCtaText}>{section.cta}</Text>
        {section.description ? <Text style={Styles.contentDescriptionText}>{section.description}</Text> : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={Styles.pillsContent}
          keyboardShouldPersistTaps='always'
        >
          {section.step === photoStep
            ? this.renderPhotos(section)
            : section.step === brandStep
            ? this.renderBrands(section)
            : this.renderPills(section)}
        </ScrollView>
      </Animatable.View>
    )
  };

  renderPhotoPreview = (imagePath, key, idx = 1, small = false) => {
    return (
      <ProgressImage
        indicator={ProgressCircle}
        indicatorProps={progressIndicatorProps}
        threshold={200}
        animation={'slideInRight'}
        duration={300}
        key={`image${idx}`}
        easing={'ease'}
        source={{ uri: imagePath }}
        style={Styles.productThumb(small)}
        resizeMode='cover'
      />
    )
  };

  handleGoToCamera = () => {
    if (this.state.canNavigate) {
      this.setState(
        {
          canNavigate: false
        },
        () => {
          this.props.navigation.navigate('Index', { transition: 'slideInTransition' })
        }
      )
    }
  };

  renderPhotos = (section, small = false) => {
    const { photos } = this.props
    const fakePhotos = [`photoHero`, `photoSide1`, `photoSide2`, `photoSide3`]
    let renderedPhotos
    if (photos.length === 0 && section.step <= photoStep) {
      renderedPhotos = fakePhotos.map((imagePath, idx) => (
        <Animatable.Image
          animation={'slideInRight'}
          duration={600}
          delay={300 * (idx + 1)}
          source={Images[imagePath]}
          style={Styles.fakeProductThumb(idx)}
          resizeMode='contain'
          key={`capturedImage${idx}`}
        />
      ))
    } else {
      renderedPhotos = photos.map((imagePath, idx) =>
        this.renderPhotoPreview(imagePath, `capturedImage${idx}`, idx, small)
      )
    }
    return (
      <TouchableWithoutFeedback onPress={this.handleGoToCamera}>
        <View style={Styles.photosWrapper}>{renderedPhotos}</View>
      </TouchableWithoutFeedback>
    )
  };

  selectPill = (step, pillText) => {
    if (this.state.selectedPills[step] === pillText) {
      // toggle off
      this.setState({
        selectedPills: {
          ...this.state.selectedPills,
          [step]: null
        }
      })
    } else {
      this.setState(
        {
          selectedPills: {
            ...this.state.selectedPills,
            [step]: pillText
          }
        },
        () => {
          this.setState({ currentStep: this.state.currentStep + 1 })
        }
      )
    }
  };

  renderBrands (section) {
    const { brandQuery = '', selectedPills } = this.state
    const { brands = [] } = this.props
    // allow adding only if none of the brands match
    const noMatch = !brands.find((brand) => brand.name === brandQuery)
    return (
      <Animatable.View style={Styles.brandsWrapper(brands.length > 0)}>
        <Autocomplete
          data={[brands.length === 0 || noMatch ? { add: true, _id: null, name: brandQuery } : null, ...brands]}
          defaultValue={brandQuery}
          placeholder={brandPlaceholder}
          containerStyle={Styles.autocompleteContainer}
          inputContainerStyle={Styles.autocompleteInputContainer}
          listContainerStyle={Styles.autocompleteListContainer}
          style={Styles.autocompleteInputText}
          hideResults={false}
          listStyle={Styles.autocompleteList(brandQuery.length > 0)}
          onChangeText={(text) => {
            this.props.searchBrands(text)
            this.forceUpdate()
            this.setState({
              brand: { _id: null, name: text },
              brandQuery: text,
              selectedPills: {
                ...selectedPills,
                [brandStep]: text
              }
            })
          }}
          renderItem={(data) => {
            if (!data) {
              return null
            }
            if (data.add && this.state.brandQuery !== '') {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      brand: { _id: data._id, name: data.name },
                      brandQuery: data.name,
                      selectedPills: {
                        ...selectedPills,
                        [brandStep]: data.name
                      }
                    })
                    console.log(data)
                    Keyboard.dismiss()
                  }}
                  style={Styles.addBrandWrapper}
                >
                  <Animatable.Image source={Images.addBrand} style={Styles.addBrandImage} />
                  <Text style={Styles.addBrandResult}>Add "{data.name}"</Text>
                </TouchableOpacity>
              )
            } else {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      brand: { _id: data._id, name: data.name },
                      brandQuery: data.name,
                      selectedPills: {
                        ...selectedPills,
                        [brandStep]: data.name
                      }
                    })
                    Keyboard.dismiss()
                  }}
                  style={Styles.brandWrapper}
                >
                  <Text style={Styles.brandResult}>{data.name}</Text>
                </TouchableOpacity>
              )
            }
          }}
        />
      </Animatable.View>
    )
  }

  renderPills (section) {
    const { categories } = this.props
    let data = []
    switch (section.step) {
      case photoStep:
        // photos -- taken care of in the wrapping code of `renderAccordionContent`
        data = []
        break
      case categoryStep:
        // categories
        data = Object.keys(categories)
        break
      case subcategoryStep:
        // subcategory
        data = categories[this.state.selectedPills[categoryStep]] || []
        break
      case brandStep:
        // brand
        break
    }
    let itemPlaceholder
    return data.map((item, idx) => {
      if (idx % 2 === 0) {
        // 1nd item
        itemPlaceholder = item
      }
      if ((section.step === categoryStep || section.step === subcategoryStep) && idx % 2 === 1) {
        // 2 per "column" within the row
        const isSelected = this.state.selectedPills[section.step] === item
        const isPlaceholderSelected = this.state.selectedPills[section.step] === itemPlaceholder

        return (
          <View key={`pill-${section.title}-${itemPlaceholder}-${item}-${idx}`} style={Styles.categoryPillWrapper}>
            <Pill
              onPress={this.selectPill.bind(this, section.step)}
              text={itemPlaceholder}
              style={Styles.pill}
              isSelected={isPlaceholderSelected}
            />
            <Pill
              onPress={this.selectPill.bind(this, section.step)}
              text={item}
              style={Styles.pill}
              isSelected={isSelected}
            />
          </View>
        )
      } else if (section.step !== categoryStep && section.step !== subcategoryStep) {
        const isSelected = this.state.selectedPills[section.step] === item
        return (
          <Pill
            onPress={this.selectPill.bind(this, section.step)}
            key={`pill-${section.title}-${item}-${idx}`}
            text={item}
            isSelected={isSelected}
            style={Styles.pill}
          />
        )
      } else if (
        (section.step === categoryStep || section.step === subcategoryStep) &&
        data.length % 2 !== 0 &&
        idx === data.length - 1
      ) {
        // 2 per "column" within the row but odd number and last one, so show a single
        const isSelected = this.state.selectedPills[section.step] === item

        return (
          <View key={`pill-${section.title}-${itemPlaceholder}-${item}-${idx}`} style={Styles.categoryPillWrapper}>
            <Pill
              onPress={this.selectPill.bind(this, section.step)}
              text={item}
              style={Styles.pill}
              isSelected={isSelected}
            />
          </View>
        )
      }
    })
  }

  renderConfirm = () => {
    const { currentStep } = this.state
    if (currentStep <= 4) {
      return null
    }
    return (
      <Animatable.View style={Styles.confirmWrapper} animation={'fadeIn'}>
        <View style={Styles.confirmCopyWrapper}>
          <Text style={Styles.nextStepHeading}>{currentStep === 5 ? `Nice work! :)` : `Need to make a change?`}</Text>
          <Text style={Styles.nextStepDescription}>
            {currentStep === 5
              ? `This entry looks good to go. Tap on a row to change any of the details or retake photos.`
              : `Tap on a row to change any of the details or retake photos.`}
          </Text>
        </View>
        <Animatable.Image source={Images.happyBag} style={Styles.happyBag} />
      </Animatable.View>
    )
  };

  forceBrandListRerender = () => {
    // hack to force list view in autocomplete to render
    this.scrollView.scrollTo(
      {
        y: 1,
        animated: true
      },
      this.forceUpdate
    )
  };

  accordionHeaderChange = (index) => {
    // allow user to go back
    const { currentStep, selectedPills, brand } = this.state
    if (currentStep > index) {
      this.setState({ currentStep: index + 1 }, () => {
        if (this.state.currentStep === photoStep) {
          this.handleGoToCamera()
        }
      })
    } else if (currentStep === index) {
      if (selectedPills[currentStep] || (currentStep >= 4 && brand.name)) {
        this.setState({ currentStep: index + 1 })
      }
    } else if (index > currentStep) {
      // allow user to go forward
      const { photos } = this.props
      let shouldProgress = false
      switch (index + 1) {
        case photoStep:
          shouldProgress = true
          break
        case categoryStep:
          if (photos.length >= 2) {
            shouldProgress = true
          }
          break
        case subcategoryStep:
          if (selectedPills[categoryStep] && photos.length >= 2) {
            shouldProgress = true
          }
          break
        case brandStep:
          if (selectedPills[subcategoryStep] && photos.length >= 2) {
            shouldProgress = true
          }
          break
      }
      if (shouldProgress) {
        this.setState({ currentStep: index + 1 }, () => {
          console.log('progressed to brand step')
          this.forceBrandListRerender()
        })
      }
    }
  };

  render () {
    const { title } = this.props
    const { currentStep, loading, keyboardOffset } = this.state

    return (
      <View style={[{ height: this.state.visibleHeight, backgroundColor: Colors.lightGray }]} title={title}>
        <ScrollView
          style={[
            {
              height: this.state.visibleHeight + (currentStep === brandStep ? keyboardOffset * 3 : 0),
              backgroundColor: Colors.lightGray
            }
          ]}
          scrollEventThrottle={32}
          keyboardShouldPersistTaps='always'
          ref={(sv) => {
            this.scrollView = sv
          }}
        >
          <Accordion
            align={`center`}
            sections={SECTIONS}
            renderHeader={this.renderAccordionHeader}
            renderContent={this.renderAccordionContent}
            easing={'easeInOutQuad'}
            activeSection={currentStep - 1}
            underlayColor={Colors.white}
            duration={600}
            onChange={this.accordionHeaderChange}
          />
          {this.renderConfirm()}
          <Button loading={loading} style={Styles.nextStepButton} onPress={this.handleNextStep}>
            {currentStep <= 4 ? (currentStep === 1 ? 'Get Started' : 'Confirm & Next Step') : 'Confirm & Submit'}
          </Button>
        </ScrollView>
      </View>
    )
  }
}

const enhance = compose(
  withAuth,
  withProductCreate,
  withProductUpdate,
  withBrandCreate,
  graphql(sharedQueries.productData, {
    name: 'productData',
    options: (props) => {
      return {
        variables: {
          query: { upcFormats: props.barcode }
        }
      }
    }
  }),
  withPropsOnChange(['auth'], ({ auth }) => {
    return {}
  }),
  withPropsOnChange(
    (props, nextProps) =>
      nextProps.barcode && props.barcode !== nextProps.barcode && !_get(nextProps, 'productData.loading', true),
    ({ productData, ...restProps }) => {
      const product = pathOr({}, ['productQuery', (productData.productQuery || []).length - 1], productData)
      return {
        product
      }
    }
  )
)

export default enhance(withNavigationFocus(Index, 'Index'))
