import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Loader
} from 'semantic-ui-react'

import { deleteBacklog, getSprintBacklogs } from '../api/backlogs-api'
import Auth from '../auth/Auth'
import { Backlog } from '../types/Backlog'

interface SprintProps {
  history: History
  auth: Auth
  match: {
    params: {
      sprintId: string
    }
  }
}

interface SprintState {
  backlogs: Backlog[],
  loadingBacklogs: boolean
}

export class Sprint extends React.PureComponent<SprintProps, SprintState> {
  state: SprintState = {
    backlogs: [],
    loadingBacklogs: true
  }

  onEditButtonClick = (backlogId: string) => {
    this.props.history.push(`/backlogs/${backlogId}/edit`)
  }

  onBacklogDelete = async (backlogId: string) => {
    try {
      await deleteBacklog(this.props.auth.getIdToken(), backlogId)
      this.setState({
        backlogs: this.state.backlogs.filter(backlog => backlog.backlogId != backlogId)
      })
    } catch {
      alert('Backlog deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const sprintId = this.props.match.params.sprintId
      const backlogs = await getSprintBacklogs(this.props.auth.getIdToken(), sprintId)
      this.setState({
        backlogs,
        loadingBacklogs: false
      })
    } catch (e) {
      alert(`Failed to fetch backlogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <div>
          <Header as="h1">Sprint { this.props.match.params.sprintId } Backlogs</Header>
          {this.renderBacklogs()}
        </div>
      </div>
    )
  }

  renderBacklogs() {
    if (this.state.loadingBacklogs) {
      return this.renderLoading()
    }

    return this.renderBacklogsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Backlogs
        </Loader>
      </Grid.Row>
    )
  }

  renderBacklogsList() {
    return (
      <Grid padded>
        {this.state.backlogs.map((backlog, pos) => {
          return (
            <Grid.Row key={backlog.backlogId}>
              <Grid.Column width={10} verticalAlign="middle">
                {backlog.itemName}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(backlog.backlogId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBacklogDelete(backlog.backlogId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
