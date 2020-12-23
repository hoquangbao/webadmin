import React, { Component, Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, Link } from 'react-router-dom'
//routes
import { routes } from '../../_routes'

//antd components
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
//

//app components
import PrivateRoute from '../../privateRoute'
import PageHeader from '../../components/page-header'
import './dashboard-layout.scss'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const DashboardLayout = (props) => {
  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={window.location.pathname} {...route} />
      ) : null,
    )


  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <SubMenu key="Level" icon={<UserOutlined />} title="Lessons">
            <Menu.Item key="1"><Link to="/app/lessons/1">Beginer</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/app/lessons/2">Intermediate</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/app/lessons/3">Advance</Link></Menu.Item>
          </SubMenu>
          <Menu.Item key="4" icon={<VideoCameraOutlined />}>
            <Link to="/app/posts">Posts</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200, height: '100vh' }}>
        <PageHeader />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24, textAlign: 'center', minHeight: '80vh' }}>
            <Suspense fallback={<></>}>
              <Switch>
                {renderRoutes(routes)}
                <Redirect to="/404" />
              </Switch>
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
