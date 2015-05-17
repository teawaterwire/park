var React = require('react')

var s = getStyle()

var Details = React.createClass({
  displayName: 'Details',
  propTypes: {
    parking: React.PropTypes.object
  },
  getImgUrl (suffix) {
    return 'https://justpark.com' + suffix
  },
  renderPhotos () {
    return this.props.parking.getIn(['photos', 'user_added'], []).map(photo => {
      return (
        <img
          style={s.thumb}
          key={photo.get('id')}
          src={this.getImgUrl(photo.getIn(['json_data', 'small', 'url']))}
        />
      )
    })
  },
  renderAvailability () {
    if (this.props.parking.get('available')) {
      return <span className='success'>available</span>
    }
    return 'not available'
  },
  render () {
    if (!this.props.parking) {
      return null
    }
    return (
      <section style={s.wrapper}>
        <h1>{ this.props.parking.get('title') }</h1>
        <h2>
          { this.renderAvailability() }
        </h2>
        <h3>
          { this.props.parking.get('spaces_to_rent') } space(s)
        </h3>
        <div style={s.thumbWrapper}>
          { this.renderPhotos() }
        </div>
        <div>
          <strong>Price: </strong>
          { this.props.parking.getIn(['display_price', 'formatted_price']) }
          /
          { this.props.parking.getIn(['display_price', 'period']) }
        </div>
        <div>
          <strong>Rating: </strong>
          <span>{ this.props.parking.getIn(['feedback', 'rating']) } </span>
          ({ this.props.parking.getIn(['feedback', 'count']) })
        </div>
        <div>
          <strong>Facilities: </strong>
          { this.props.parking.get('facilities').join(', ') }
        </div>
      </section>
    )
  }
})

module.exports = Details

function getStyle () {
  return {
    thumb: {
      display: 'inline-block',
      height: 200,
      margin: 10
    },
    thumbWrapper: {
      left: 20,
      maxHeight: 230,
      overflowX: 'scroll',
      position: 'relative',
      whiteSpace: 'nowrap'
    },
    wrapper: {
      margin: '0 20px'
    }
  }
}
