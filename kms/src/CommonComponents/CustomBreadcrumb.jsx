/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

/**
 * CustomBreadcrumb is used to diaplay breadcrumb in every page.
 * There are the following props:
 * @property {string} primaryHeading maybe:"todo","plan","dream","personal"
 * @property {string} secondaryHeading
 * */

export default class CustomBreadcrumb extends Component {
  constructor(props) {
    super(props);
  }

  displayPrimaryBreadcrumb = () => {
    switch (this.props.primaryHeading) {
      case 'todo':
        return (
          <>
            <Breadcrumb.Item>To-do</Breadcrumb.Item>
            {this.displayTodoSecondaryBreadcrumb()}
          </>
        );
        break;
      case 'plan':
        return (
          <>
            <Breadcrumb.Item>Plan</Breadcrumb.Item>
            {this.displayPlanSecondaryBreadcrumb()}
          </>
        );
        break;
      case 'dream':
        return (
          <>
            <Breadcrumb.Item>Dream</Breadcrumb.Item>
            {this.displayDreamSecondaryBreadcrumb()}
          </>
        );
        break;
      case 'personal':
        return (
          <>
            <Breadcrumb.Item>Personal</Breadcrumb.Item>
            {this.displayMineSecondaryBreadcrumb()}
          </>
        );
        break;
      default:
        return (
          <>
            <Breadcrumb.Item>
              <Link to="/todo">To-do</Link>
            </Breadcrumb.Item>
            {this.displayTodoSecondaryBreadcrumb()}
          </>
        );
        break;
    }
  };

  displayTodoSecondaryBreadcrumb = () => {
    switch (this.props.secondaryHeading) {
      case 'todohome':
        return (
          <Breadcrumb.Item>
            <Link to="/todo">Home</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'todoList':
        return (
          <Breadcrumb.Item>
            <Link to="/todo/todos">To-do List</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'ideaList':
        return (
          <Breadcrumb.Item>
            <Link to="/todo/ideas">Inspired Collection Station</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'todohabit':
        return (
          <Breadcrumb.Item>
            <Link to="todo/habits">Habit-building Program</Link>
          </Breadcrumb.Item>
        );
        break;
      default:
        return (
          <Breadcrumb.Item>
            <Link to="/todo">Home</Link>
          </Breadcrumb.Item>
        );
        break;
    }
  };

  displayPlanSecondaryBreadcrumb = () => {
    switch (this.props.secondaryHeading) {
      case 'planhome':
        return (
          <Breadcrumb.Item>
            <Link to="/plan">Home</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'planList':
        return (
          <Breadcrumb.Item>
            <Link to="/plan/plans">Plan List</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'planPerson':
        return (
          <Breadcrumb.Item>
            <Link to="/plan/persons">Related People</Link>
          </Breadcrumb.Item>
        );
        break;
      default:
        return (
          <Breadcrumb.Item>
            <Link to="/plan">Home</Link>
          </Breadcrumb.Item>
        );
        break;
    }
  };

  displayDreamSecondaryBreadcrumb = () => {
    switch (this.props.secondaryHeading) {
      case 'dreamhome':
        return (
          <Breadcrumb.Item>
            <Link to="/dream">Home</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'dreamList':
        return (
          <Breadcrumb.Item>
            <Link to="/dream/dreams">Dream List</Link>
          </Breadcrumb.Item>
        );
        break;
      default:
        return (
          <Breadcrumb.Item>
            <Link to="/dream">Home</Link>
          </Breadcrumb.Item>
        );
        break;
    }
  };

  displayMineSecondaryBreadcrumb = () => {
    switch (this.props.secondaryHeading) {
      case 'message':
        return (
          <Breadcrumb.Item>
            <Link to="/mine">Personal Information</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'image':
        return (
          <Breadcrumb.Item>
            <Link to="/mine/images">Personal Values</Link>
          </Breadcrumb.Item>
        );
        break;
      case 'skill':
        return (
          <Breadcrumb.Item>
            <Link to="/mine/skills">Skills Required</Link>
          </Breadcrumb.Item>
        );
        break;
      default:
        return (
          <Breadcrumb.Item>
            <Link to="/mine">Personal Information</Link>
          </Breadcrumb.Item>
        );
        break;
    }
  };

  render() {
    return (
      <>
        <Breadcrumb style={{ margin: '10px 0' }}>{this.displayPrimaryBreadcrumb()}</Breadcrumb>
      </>
    );
  }
}
