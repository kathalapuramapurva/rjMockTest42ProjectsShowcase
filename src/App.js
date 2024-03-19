import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from './components/ProjectItem'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const allAPIStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class App extends Component {
  state = {
    activeOption: categoriesList[0].id,
    projectsList: [],
    apiStatus: allAPIStatus.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: allAPIStatus.inProgress})
    const {activeOption} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const response = await fetch(url)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedList = data.projects.map(project => ({
        id: project.id,
        name: project.name,
        imageUrl: project.image_url,
      }))
      this.setState({
        projectsList: updatedList,
        apiStatus: allAPIStatus.success,
      })
    } else {
      this.setState({apiStatus: allAPIStatus.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeOption: event.target.value}, this.getProjects)
  }

  onRetryProjectList = () => {
    this.getProjects()
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list">
        {projectsList.map(project => (
          <ProjectItem key={project.id} projectDetails={project} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onRetryProjectList}
      >
        Retry
      </button>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case allAPIStatus.success:
        return this.renderSuccessView()
      case allAPIStatus.failure:
        return this.renderFailureView()
      case allAPIStatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state
    console.log(activeOption)
    return (
      <div className="app-container">
        <div className="header-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="content-container">
          <select
            className="style-select"
            value={activeOption}
            onChange={this.onChangeOption}
          >
            {categoriesList.map(category => (
              <option
                className="style-option"
                key={category.id}
                value={category.id}
              >
                {category.displayText}
              </option>
            ))}
          </select>

          <div className="projects-container">{this.renderSwitch()}</div>
        </div>
      </div>
    )
  }
}

export default App
