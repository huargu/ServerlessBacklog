import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  DropdownProps
} from 'semantic-ui-react'

import { createBacklog, deleteBacklog, getBacklogs, getSprintBacklogs, getSprints, patchBacklog } from '../api/backlogs-api'
import Auth from '../auth/Auth'
import { Backlog } from '../types/Backlog'
import { SprintType } from '../types/Sprint'

interface BacklogsProps {
  auth: Auth
  history: History
}

interface BacklogsState {
  backlogs: Backlog[],
  sprints: SprintType[],
  newBacklogName: string,
  selectedSprintId: string,
  loadingBacklogs: boolean,
  loadingSprints: boolean
}

export class Backlogs extends React.PureComponent<BacklogsProps, BacklogsState> {
  state: BacklogsState = {
    backlogs: [],
    sprints: [],
    selectedSprintId: '0',
    newBacklogName: '',
    loadingBacklogs: true,
    loadingSprints: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBacklogName: event.target.value })
  }

  onEditButtonClick = (backlogId: string, userId: string) => {
    this.props.history.push(`/backlogs/${backlogId}/edit`)
  }

  onSprintChange = (sprintId: string) => {
    this.props.history.push(`/sprints/${sprintId}`)
  }

  onBacklogCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newBacklog = await createBacklog(this.props.auth.getIdToken(), {
        itemName: this.state.newBacklogName
      })
      this.setState({
        backlogs: [...this.state.backlogs, newBacklog],
        newBacklogName: ''
      })
    } catch {
      alert('Backlog creation failed')
    }
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
      const backlogs = await getBacklogs(this.props.auth.getIdToken())
      const sprints = await getSprints(this.props.auth.getIdToken())
      this.setState({
        backlogs,
        sprints,
        loadingBacklogs: false,
        loadingSprints: false
      })
    } catch (e) {
      alert(`Failed to fetch backlogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <div>
          {this.renderSprints()}
          <Header as="h1">Backlogs</Header>
          {this.renderCreateBacklogInput()}
          {this.renderBacklogs()}
        </div>
      </div>
    )
  }

  renderCreateBacklogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Backlog Item',
              onClick: this.onBacklogCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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

  renderLoadingSprints() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Sprints
        </Loader>
      </Grid.Row>
    )
  }
  renderSprints() {
    if (this.state.loadingSprints) {
      return this.renderLoadingSprints()
    }

    return this.renderSprintList()
  }

  renderSprintList() {
    const dropdownItems = this.state.sprints.map(function(sprint) {
      return {
        key: sprint.sprintId,
        text: sprint.sprintId,
        value: sprint.sprintId
      }
    })

    return (<Grid.Row>
      <Grid.Column>
        <h3>Sprints</h3>
      </Grid.Column>
      <Grid.Column width={13}>
        <Dropdown
          placeholder='Select Sprint'
          fluid
          selection
          options={dropdownItems}
          value={this.state.selectedSprintId}
          onChange={this.handleChange}
        />
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
    )
  }

  handleChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.onSprintChange(String(data.value))
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
                  onClick={() => this.onEditButtonClick(backlog.backlogId, backlog.userId)}
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
