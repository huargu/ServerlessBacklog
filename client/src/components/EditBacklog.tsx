import * as React from 'react'
import { Form, Button, Dropdown, DropdownProps } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getSprints, uploadFile, patchBacklog } from '../api/backlogs-api'
import { SprintType } from '../types/Sprint'

interface EditBacklogProps {
  match: {
    params: {
      backlogId: string,
      sprintId: string
    }
  }
  auth: Auth
}

interface EditBacklogState {
  file: any,
  sprints: SprintType[],
  sprintId: string
}

export class EditBacklog extends React.PureComponent<
  EditBacklogProps,
  EditBacklogState
> {
  state: EditBacklogState = {
    file: undefined,
    sprintId: '0',
    sprints: []
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      const updateReq = { sprint: this.state.sprintId, oldSprint: this.props.match.params.sprintId }
      await patchBacklog(this.props.auth.getIdToken(), this.props.match.params.backlogId, updateReq);

      alert('Backlog item moved into a sprint!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    }
  }

  async componentDidMount() {
    try {
      const sprints = await getSprints(this.props.auth.getIdToken())
      this.setState({
        sprints
      })
    } catch (e) {
      alert(`Failed to fetch backlogs: ${e.message}`)
    }
  }

  render() {
    const dropdownItems = this.state.sprints.map(function(sprint) {
      return {
        key: sprint.sprintId,
        text: sprint.sprintId,
        value: sprint.sprintId
      }
    })

    return (
      <div>
        <h1>Edit backlog sprint</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Sprint Select</label>
          <Dropdown
            placeholder='Select Sprint'
            fluid
            selection
            options={dropdownItems}
            value={this.state.sprintId}
            onChange={this.handleChange}
          />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  handleChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ sprintId: String(data.value) })
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update sprint
        </Button>
      </div>
    )
  }
}
