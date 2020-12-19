import React, {Component} from 'react';
import { withRouter } from "react-router";
import { Button, Form, Col } from 'react-bootstrap';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            design_no: null,
            design_name: null,
            design_quantity: null,
            design_price: null,
        };
    }

    onChangeInput = (type, e) => {
        switch(type) {
            case 'design_no': {
                this.setState({ design_no: e.target.value })
                break;
            }
            case 'design_name': {
                this.setState({ design_name: e.target.value })
                break;
            }
            case 'design_quantity': {
                this.setState({ design_quantity: e.target.value })
                break;
            }
            case 'design_price': {
                this.setState({ design_price: e.target.value })
                break;
            }
            default: {
                break;
            }
        }
    }

    createNewDesign = () => {
        console.log("--------", this.state);
    }

    render() {
        return (
            <div className="App">
                <span> Create a new Design </span>
                <div className="display-inline">
                    <div> Design Number &nbsp; </div>
                    <Form.Group as={Col}>
                        <Form.Control
                            type="number"
                            value={this.state.design_no}
                            placeholder="10"
                            onChange={this.onChangeInput.bind(this, 'design_no')}
                        >
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="display-inline">
                    <div> Design Name &nbsp; </div>
                    <Form.Group as={Col}>
                        <Form.Control
                            type="text"
                            value={this.state.design_name}
                            placeholder=""
                            onChange={this.onChangeInput.bind(this, 'design_name')}
                            maxLength={32}
                        >
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="display-inline">
                    <div> Design Quantity &nbsp; </div>
                    <Form.Group as={Col}>
                        <Form.Control
                            type="number"
                            value={this.state.design_quantity}
                            placeholder="100"
                            onChange={this.onChangeInput.bind(this, 'design_quantity')}
                        >
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="display-inline">
                    <div> Design Price &nbsp; </div>
                    <Form.Group as={Col}>
                        <Form.Control
                            type="number"
                            value={this.state.design_price}
                            placeholder="499"
                            onChange={this.onChangeInput.bind(this, 'design_price')}
                        >
                        </Form.Control>
                    </Form.Group>
                </div>
                <Button onClick={this.createNewDesign}> Create </Button>
            </div>
        );
    }
}

export default withRouter(Create);