export default {
  // Functions return fixtures
  getDummy: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  getCategoryMap: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  getData: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  searchBrands: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  searchBrandByName: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  uploadMedia: () => {
    return {
      ok: true,
      data: require('../Fixtures/dummy.json')
    }
  },
  getInstance: () => {
    return {
      headers: 'headers',
      getBaseURL: () => 'blah.com'
    }
  }
}
