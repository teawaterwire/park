/* global google fetch Velocity */
var React = require('react')
var Immutable = require('immutable')

// React components
var Details = require('./details.js')

// Styling with Javascript (you'll like it eventually!)
var s = getStyle()
var BREAKPOINT = 480

var SearchResults = React.createClass({
  displayName: 'SearchResults',
  getInitialState () {
    return {
      parkings: Immutable.List(),
      selected: -1,
      isMobile: window.innerWidth < BREAKPOINT
    }
  },
  handleResize () {
    this.setState({isMobile: window.innerWidth < BREAKPOINT})
  },
  componentDidMount () {
    fetch('listing.json')
      .then(res => res.json())
      .then(listing => {
        var Ilisting = Immutable.fromJS(listing)
        var parkings = Ilisting.get('data')
        this.renderMap(Ilisting.get('coords').map(v => parseFloat(v)))
        this.renderMarkers(parkings)
        this.setState({ // eslint-disable-line
          parkings: parkings
        })
      })
    // Making it properly responsive
    window.addEventListener('resize', this.handleResize)
  },
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  },
  renderMap (coords) {
    var mapOptions = {center: coords.toJS(), zoom: 16}
    var mapCanvas = React.findDOMNode(this.refs.mapCanvas)
    this.map = new google.maps.Map(mapCanvas, mapOptions)
    this.directionsService = new google.maps.DirectionsService()
    this.directionsDisplay = new google.maps.DirectionsRenderer()
    this.directionsDisplay.setMap(this.map)
  },
  renderMarkers (parkings) {
    parkings.forEach((parking, i) => {
      var marker = new google.maps.Marker({
        map: this.map,
        position: parking.get('coords').toJS(),
        animation: google.maps.Animation.DROP,
        icon: 'http://www.googlemapsmarkers.com/v1/' + i + '/00b303/',
        title: parking.get('title')
      })
      google.maps.event.addListener(marker, 'click', () => {
        var selected = this.state.selected
        if (this.state.isMobile) {
          let mobilePane = React.findDOMNode(this.refs.mobilePane)
          Velocity(mobilePane, 'scroll')
        } else {
          let pane = React.findDOMNode(this.refs.pane)
          let mapCanvas = React.findDOMNode(this.refs.mapCanvas)
          if (selected === i) {
            Velocity({e: pane, p: {translateZ: 0, translateX: 0}})
            Velocity({e: mapCanvas, p: {width: '100%'}})
          } else {
            if (selected === -1) {
              Velocity({e: pane, p: {translateZ: 0, translateX: '-100%'}})
              Velocity({e: mapCanvas, p: {width: '70%'}})
            } else {
              Velocity(pane, 'callout.bounce')
            }
          }
        }
        this.setState({selected: selected === i ? -1 : i})
        // Drawing directions
        this.directionsService.route({
          origin: marker.getPosition(),
          destination: new google.maps.LatLng(51.55585300, -0.27959400),
          travelMode: google.maps.TravelMode.WALKING
        }, response => this.directionsDisplay.setDirections(response))
      })
    })
  },
  renderPaneContent () {
    if (this.state.selected !== -1) {
      return <Details parking={this.state.parkings.get(this.state.selected)} />
    }
  },
  render () {
    return (
      <div className='h100'>
        <div className='h100' ref='mapCanvas'></div>
        <div className='widget' ref='mobilePane'>
          { this.state.isMobile ? this.renderPaneContent() : null }
        </div>
        <div className='h100 widget' style={s.pane} ref='pane'>
          { !this.state.isMobile ? this.renderPaneContent() : null }
        </div>
      </div>
    )
  }
})

React.render(<SearchResults />, document.body)

function getStyle () {
  return {
    pane: {
      boxShadow: '-5px 0px 21px #666',
      left: '100%',
      position: 'absolute',
      top: 0,
      width: '30%'
    }
  }
}
