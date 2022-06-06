/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dream from './Components/Dream';
import Plan from './Components/Plan';
import Todo from './Components/Todo';
import Mine from './Components/Mine';
import HabitList from './Components/Todo/HabitList';
import NavigationBar from './CommonComponents/NavigationBar';
import Test from './Components/Test';
import ImageList from './Components/Mine/ImageList';
import SkillList from './Components/Mine/SkillList';
import TodoList from './Components/Todo/TodoList';
import IdeaList from './Components/Todo/IdeaList';
import PlanList from './Components/Plan/PlanList';
import PeopleList from './Components/Plan/PeopleList';
import DreamList from './Components/Dream/DreamList';
import AdminPage from './Components/AdminPage';
import Login from './CommonComponents/Login';
import Register from './CommonComponents/Register';
import './CommonComponents/commonComponents.css';
import RedirectRouter from './CommonComponents/Private/RedirectRouter';
import { getCookie } from './Services/cookies';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={getCookie() ? <NavigationBar /> : <Navigate to="/login" replace />}>
            {/* <Route index element={getCookie() ? <Todo /> : <Navigate to="/login" replace />} /> */}
            <Route index element={getCookie() ? <DreamList /> : <Navigate to="/login" replace />} />
            <Route element={getCookie() ? <Todo /> : <Navigate to="/login" replace />} path="/todo" />
            <Route element={getCookie() ? <TodoList /> : <Navigate to="/login" replace />} path="/todo/todos" />
            <Route element={getCookie() ? <HabitList /> : <Navigate to="/login" replace />} path="/todo/habits" />
            <Route element={getCookie() ? <IdeaList /> : <Navigate to="/login" replace />} path="/todo/ideas" />
            <Route element={getCookie() ? <Plan /> : <Navigate to="/login" replace />} path="/plan" />
            <Route element={getCookie() ? <PlanList /> : <Navigate to="/login" replace />} path="/plan/plans" />
            <Route element={getCookie() ? <PeopleList /> : <Navigate to="/login" replace />} path="/plan/persons" />
            <Route element={getCookie() ? <Dream /> : <Navigate to="/login" replace />} path="/dream" />
            <Route element={getCookie() ? <DreamList /> : <Navigate to="/login" replace />} path="/dream/dreams" />
            <Route element={getCookie() ? <Mine /> : <Navigate to="/login" replace />} path="/mine" />
            <Route element={getCookie() ? <ImageList /> : <Navigate to="/login" replace />} path="/mine/images" />
            <Route element={getCookie() ? <SkillList /> : <Navigate to="/login" replace />} path="/mine/skills" />
          </Route>
          <Route path="/admin" element={getCookie() ? <AdminPage /> : <Navigate to="/login" replace />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/test" element={<Test />}></Route>
        </Routes>
      </div>
    );
  }
}
