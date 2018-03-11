var storage = {
    setItem: function (key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    getItem: function (key, defaultValue) {
      defaultValue = defaultValue || null
      try {
        var data = localStorage.getItem(key)
        if (!data) {
          return defaultValue
        }
        return JSON.parse(data)
      } catch (e) {
        return defaultValue
      }
    }
  }

  export default storage
