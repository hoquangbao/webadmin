import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { request, requestNoti } from '../../config/axios'

import { Spin, Space, Row, Table, message, Image, Tag, Modal, Button } from 'antd';


// import { getCurrentUser } from '../../utils/firebase'

const PostsView = (props) => {
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [isModalLoading, setModalLoading] = React.useState(false)
  const [modalContent, setModalContent] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [dataSource, setDataSource] = React.useState([])

  const showModal = (record) => {
    setModalVisible(true)
    setModalContent(record)
  }

  const tagColor = status => {
    if (status.trim() === 'APPROVED') {
      return 'green'
    } else if (status.trim() === 'PENDING') {
      return 'orange'
    } else if (status.trim() === 'UNAPPROVED') {
      return 'red'
    } else {
      return 'black'
    }
  }
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 800
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: [
        {
          text: 'APPROVED',
          value: 'APPROVED'
        },
        {
          text: 'UNAPPROVED',
          value: 'UNAPPROVED'
        },
        {
          text: 'PENDING',
          value: 'PENDING'
        },
      ],
      onFilter: (value, record) => record.status.trim() === value,
      sorter: (a, b) => a.status.trim().length - b.status.trim().length,
      sortDirections: ['ascend'],
      render: (status) => (
        <Tag key={status} color={tagColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record) => {
        return (
          <Space size="middle">
            <button type="primary" onClick={() => showModal(record)}>Edit</button>
          </Space>
        )
      }
    },
  ]
  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await request.get(`/api/admin/getAllPost`)
        if (result.code === 200) {
          const { data } = result
          const tableData = data.map(post => {
            return {
              key: post.id,
              ...post
            };
          })
          setDataSource(tableData)
          setLoading(false)
        } else {
          message.error({
            content: 'Something went wrong!',
            style: {
              position: 'fixed',
              bottom: '10px',
              left: '50%'
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchPosts();
  }, [])

  const handleBan = () => {
    async function changeStatus() {
      try {
        setModalLoading(true)
        const result = await request.put(`/api/admin/${modalContent.id}/changeStatus/UNAPPROVED`)
        if (result.code === 200) {
          setDataSource(() =>
            dataSource.map(row => {
              if (row.id === modalContent.id) {
                row.status = 'UNAPPROVED'
              }
              return row
            })
          )
          console.log("change success")
          setModalLoading(false)
          setModalVisible(false)
        } else {
          message.error({
            content: 'Something went wrong!',
            style: {
              position: 'fixed',
              bottom: '10px',
              left: '50%'
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    changeStatus();
    async function sendNotification() {
      try {
        setModalLoading(true)
        const result = await requestNoti.post(`/api/admin/noti`, {
          body: 'Your post has been banned',
          title: modalContent.title,
          topic: modalContent.username
        })
        if (result.code === 200) {
          console.log("send notification success")
          setModalLoading(false)
          setModalVisible(false)
        } else {
          message.error({
            content: 'Something went wrong!',
            style: {
              position: 'fixed',
              bottom: '10px',
              left: '50%'
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    sendNotification();
  }

  console.log(modalContent)

  const handleApprove = () => {
    async function changeStatus() {
      try {
        setModalLoading(true)
        const result = await request.put(`/api/admin/${modalContent.id}/changeStatus/APPROVED`)
        if (result.code === 200) {
          setDataSource(() =>
            dataSource.map(row => {
              if (row.id === modalContent.id) {
                row.status = 'APPROVED'
              }
              return row
            })
          )
          console.log("change success")
          setModalLoading(false)
          setModalVisible(false)
        } else {
          message.error({
            content: 'Something went wrong!',
            style: {
              position: 'fixed',
              bottom: '10px',
              left: '50%'
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    changeStatus();
    async function sendNotification() {
      try {
        setModalLoading(true)
        const result = await requestNoti.post(`/api/admin/noti`, {
          body: 'Your post has been approved',
          title: modalContent.title,
          topic: modalContent.username
        })
        if (result.code === 200) {
          console.log("send success")
          setModalLoading(false)
          setModalVisible(false)
        } else {
          message.error({
            content: 'Something went wrong!',
            style: {
              position: 'fixed',
              bottom: '10px',
              left: '50%'
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    sendNotification();
  }

  const handleChange = (pagination, filters, sorter) => {
    console.log("Parameter: ", filters, sorter)
  }

  return (
    <>
      {
        loading ?
          <Row justify="center" align="middle" style={{ width: '100%', height: '80vh' }}>
            <Space size="middle">
              <Spin size="large" />
            </Space>
          </Row> :
          <Row style={{ width: '100%', height: '80vh' }} justify="center">
            <Table
              dataSource={dataSource}
              columns={columns}
              onChange={handleChange}
              pagination={{
                position: ['topRight', 'bottomRight'],
                pageSize: 10
              }}
            />
            <Modal
              title="Edit"
              visible={isModalVisible}
              width={900}
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button
                  key="ban"
                  danger
                  loading={isModalLoading}
                  onClick={handleBan}
                  disabled={modalContent.status === 'UNAPPROVED'}
                >
                  Ban
                </Button>,
                <Button
                  key="approve"
                  default
                  loading={isModalLoading}
                  onClick={handleApprove}
                  style={{ color: '#52c41a', borderColor: '#b7eb8f' }}
                  disabled={modalContent.status ? modalContent.status.trim() === 'APPROVED' : ''}
                >
                  Approve
                </Button>,
              ]}
            >
              <div
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
              >
                <h3>Post ID</h3><p>{modalContent && modalContent.id}</p>
                <h3>Post Title</h3><p>{modalContent && modalContent.title}</p>
                <h3>Post Content</h3><p>{modalContent && modalContent.text}</p>
                <h3>Attached File</h3>
                {
                  modalContent.link ? <video key={modalContent.link} width="320" height="240" controls>
                    <source src={modalContent.link} type="video/mp4" />
                  </video> : null
                }
                <h3>Post Owner</h3><p>{modalContent && modalContent.studentName}</p>
                <h3>Post Status</h3>
                <Tag color={tagColor(modalContent.status || '')}>
                  {modalContent.status}
                </Tag>
              </div>
            </Modal>
          </Row>
      }
    </>
  )
}
export default connect(state => ({
}), dispatch => ({
}))(PostsView)
