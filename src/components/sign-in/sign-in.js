import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Typography, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { request, setToken } from '../../config/axios'

import Creators from '../../redux/user'

const SignIn = (props) => {
  const onFinish = async values => {
    try {
      props.signInStart()
      const { data: { tokenType, accessToken } } = await request.post('/api/admin/login-admin', values)
      if (tokenType === 'Bearer') {
        console.log("okay")
        props.signInSuccess(accessToken)
      } else {
        message.error(accessToken)
      }
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    console.log(props)
    if (props.isLogin) {
      props.history.push('/')
    }
  }, [props.isLogin])

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row type="flex" justify="center" style={{ minHeight: '100vh' }}>
      <Col span={6} justify="center" align="middle" style={{ padding: '16px 24px', minHeight: '640px', borderRadius: '30px', marginTop: '64px' }}>
        <Avatar size={48} icon={<UserOutlined />} justify="center" style={{ color: '#fff', backgroundColor: 'rgb(220, 0, 78)' }} />
        <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Sign in</Typography>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input size="large" style={{ padding: '18.5px 14px' }} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" style={{ padding: '18.5px 14px' }} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};


export default connect(state => ({
  isLogin: state.user.isLogin,
}), dispatch => ({
  signInStart: () => dispatch(Creators.signInStart()),
  signInSuccess: (token) => dispatch(Creators.signInSuccess(token))
}))(withRouter(SignIn));
