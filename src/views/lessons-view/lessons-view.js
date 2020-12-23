import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { request } from '../../config/axios'
import { storage } from '../../firebase/firebase.utils'

import { Spin, Space, Row, Table, message, Image, Modal, Tabs, Input, Button, Form, Typography, Upload, Dropdown, Menu } from 'antd';
import { LoadingOutlined, PlusOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
const { TabPane } = Tabs;
const { Text } = Typography


// import { getCurrentUser } from '../../utils/firebase'

const LessonsView = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [dataSource, setDataSource] = React.useState([])
  const [vocabularyDataSource, setVocabularyDataSource] = React.useState([])
  const [conversationDataSource, setConverastionDataSource] = React.useState([])
  const [quizDataSource, setQuizDataSource] = React.useState([])
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [isVocabularyUpdateModalVisible, setVocabularyUpdateModalVisible] = React.useState(false)
  const [isVocabularyCreateModalVisible, setVocabularyCreateModalVisible] = React.useState(false)
  const [isLessonCreateModalVisible, setLessonCreateModalVisible] = React.useState(false)
  const [isQuizCreateModalVisible, setQuizCreateModalVisible] = React.useState(false)
  const [isDropDownCreateModalVisible, setDropDownCreateModalVisible] = React.useState(false)
  const [isConversationCreateModalVisible, setConversationCreateModalVisible] = React.useState(false)
  const [isConversationUpdateModalVisible, setConversationUpdateModalVisible] = React.useState(false)
  const [isQuizUpdateModalVisible, setQuizUpdateModalVisible] = React.useState(false)
  const [isDropDown, setDropDown] = React.useState(true)
  const [vocabularyModalContent, setVocabularyModalContent] = React.useState({})
  const [vocabularyCreateModalContent, setVocabularyCreateModalContent] = React.useState({})
  const [conversationCreateModalContent, setConversationCreateModalContent] = React.useState({})
  const [lessonCreateModalContent, setLessonCreateModalContent] = React.useState({})
  const [quizCreateModalContent, setQuizCreateModalContent] = React.useState({})
  const [conversationModalContent, setConversationModalContent] = React.useState({})
  const [quizModalContent, setQuizModalContent] = React.useState({})
  const [isSomethingLoading, setSomethingLoading] = React.useState(false)
  const [quizType, setQuizType] = React.useState(false)
  const [vocaForm] = Form.useForm()
  const [conversationForm] = Form.useForm()
  const [quizForm] = Form.useForm()
  const [currentLesson, setCurrentLesson] = React.useState(-1)
  const [currentLevel, setCurrentLevel] = React.useState(0)
  const columns = [
    {
      title: 'Lesson ID',
      dataIndex: 'lessonID',
      key: 'lessonID',
      width: 150
    },
    {
      title: 'Name',
      dataIndex: 'lessonName',
      key: 'lessonName',
      width: 150
    },
    {
      title: 'Image',
      dataIndex: 'lessonImage',
      key: 'lessonImage',
      width: 150,
      render: text => <Image src={text} width={100} />
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
  const vocabularyColumn = [
    {
      title: 'Vocabulary ID',
      dataIndex: 'id',
      key: 'vocabularyID',
      width: 150
    },
    {
      title: 'Vocabulary',
      dataIndex: 'vocabulary',
      key: 'vocabulary',
      width: 300
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'vocabularyImage',
      width: 150,
      render: text => <Image src={text} width={100} />
    },
    {
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record) => {
        return (
          <Space size="middle">
            <button type="primary" onClick={() => showVocabularyUpdateModal(record)}>Update</button>
          </Space>
        )
      }
    },
  ]
  const conversationColumn = [
    {
      title: 'Conversation ID',
      dataIndex: 'id',
      key: 'conversationID',
      width: 150
    },
    {
      title: 'Conversation',
      dataIndex: 'conversation',
      key: 'conversation',
      width: 300
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record) => {
        return (
          <Space size="middle">
            <button type="primary" onClick={() => showConversationUpdateModal(record)}>Update</button>
          </Space>
        )
      }
    },
    // {
    //   title: 'Image',
    //   dataIndex: 'conversationImage',
    //   key: 'conversationImage',
    //   width: 150,
    //   render: text => <Image src={text} width={100} />
    // },
  ]
  const quizColumn = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 150
    },
    {
      title: 'Answer A',
      dataIndex: 'answer_a',
      key: 'answer_a',
      width: 150,
      render: record => <Text type={record.checkCorrect === true ? 'success' : 'danger'}>{record.optionName}</Text>
    },
    {
      title: 'Answer B',
      dataIndex: 'answer_b',
      key: 'answer_b',
      width: 150,
      render: record => <Text type={record.checkCorrect === true ? 'success' : 'danger'}>{record.optionName}</Text>
    },
    {
      title: 'Answer C',
      dataIndex: 'answer_c',
      key: 'answer_c',
      width: 150,
      render: record => <Text type={record.checkCorrect === true ? 'success' : 'danger'}>{record.optionName}</Text>
    },
    {
      title: 'Answer D',
      dataIndex: 'answer_d',
      key: 'answer_d',
      width: 150,
      render: record => <Text type={record.checkCorrect === true ? 'success' : 'danger'}>{record.optionName}</Text>
    },
    {
      title: 'Action',
      dataIndex: 'edit',
      key: 'edit',
      width: 150,
      render: (text, record) => {
        return (
          <Space size="middle">
            <button type="primary" onClick={() => showQuizUpdateModal(record)}>Update</button>
          </Space>
        )
      }
    },
    // {
    //   title: 'Options',
    //   dataIndex: 'options',
    //   key: 'options',
    //   width: 300
    // },
  ]

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Multiple choice
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />} >
        Audio
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        Video
      </Menu.Item>
    </Menu>
  );

  function handleMenuClick(e) {
    setQuizType(e.keyPath[0]);
    setDropDown(false);
  }

  const showVocabularyUpdateModal = (record) => {
    console.log(record)
    vocaForm.setFieldsValue(record)
    setVocabularyModalContent(record)
    setVocabularyUpdateModalVisible(true)
  }

  const showConversationUpdateModal = (record) => {
    console.log(record)
    conversationForm.setFieldsValue(record)
    setConversationModalContent(record)
    setConversationUpdateModalVisible(true)
  }

  const showQuizUpdateModal = (record) => {
    console.log(record)
    quizForm.setFieldsValue(record)
    setQuizModalContent(record)
    setQuizUpdateModalVisible(true)
  }

  const showVocabularyCreateModal = () => {
    setVocabularyCreateModalVisible(true)
  }

  const showConversationCreateModal = () => {
    setConversationCreateModalVisible(true)
  }

  const showQuizCreateModal = () => {
    setQuizCreateModalVisible(true)
  }

  const showQuizDropDownCreateModal = () => {
    setDropDownCreateModalVisible(true)
  }

  const showLessonCreateModal = () => {
    setLessonCreateModalVisible(true)
  }

  const showModal = (record) => {
    console.log("voca content: ", vocabularyDataSource)
    setCurrentLesson(record.lessonID)
    async function fetchVocabulary() {
      try {
        const result = await request.get(`/api/admin/getVocabulary/${record.lessonID}`)
        if (result.code === 200) {
          const { data } = result
          const tableData = data.map(vocabulary => ({
            key: vocabulary.id,
            ...vocabulary
          }))
          console.log("Set voca data source")
          setVocabularyDataSource(tableData)
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
    fetchVocabulary();
    async function fetchConversation() {
      try {
        const result = await request.get(`/api/admin/getConversation/${record.lessonID}`)
        if (result.code === 200) {
          const { data } = result
          const tableData = data.map(conversation => ({
            key: conversation.id,
            ...conversation
          }))
          setConverastionDataSource(tableData)
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
    fetchConversation();
    async function fetchQuiz() {
      try {
        const result = await request.get(`/api/admin/getQuestion/${record.lessonID}`)
        if (result.code === 200) {
          const { data } = result
          const tableData = data.map(quiz => {
            quiz.key = quiz.questionID;
            quiz.answer_a = quiz.options[0]
            quiz.answer_b = quiz.options[1]
            quiz.answer_c = quiz.options[2]
            quiz.answer_d = quiz.options[3]
            return quiz
          })
          console.log(tableData)
          setQuizDataSource(tableData)
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
    fetchQuiz();
    setModalVisible(true)
  }

  useEffect(() => {
    async function fetchLessons() {
      try {
        const level = window.location.pathname.split('/').reverse()[0]
        const result = await request.get(`/api/admin/getByLevel/${level}`)
        setCurrentLevel(level)
        if (result.code === 200) {
          const { data } = result
          const tableData = data.map(lesson => ({
            key: lesson.lessonID,
            ...lesson
          }))
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

    fetchLessons();
  }, [])

  const onVocabularyFormFinish = values => {
    const preparedData = {
      ...values,
      ...vocabularyCreateModalContent,
      id: currentLesson
    }
    setSomethingLoading(true)
    async function updateVocabulary() {
      try {
        const result = await request.put(`/api/admin/updateVocabulary`, {
          "description": values.description,
          "id": values.id,
          "image": preparedData.image,
          "listVocabulary": [
            {
              "id": vocabularyModalContent.listVocabulary[0].id,
              "lessonID": vocabularyModalContent.listVocabulary[0].lessonID
            }
          ],
          "vocabulary": values.vocabulary,
          "voice_link": preparedData.voice_link,

        })
        if (result.code === 200) {
          setVocabularyDataSource(() =>
            vocabularyDataSource.map(row => {
              if (row.id === vocabularyModalContent.id) {
                return {
                  ...row,
                  ...values
                }
              }
              return row
            })
          )
          console.log("success")
          setSomethingLoading(false)
          setVocabularyUpdateModalVisible(false)
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
    updateVocabulary();
  }

  const onVocabularyCreateFormFinish = async values => {
    const preparedData = {
      ...values,
      ...vocabularyCreateModalContent,
      id: currentLesson
    }
    async function createVocabulary() {
      try {
        const result = await request.post(`/api/admin/addVocab/${currentLesson}`, {
          "description": values.description,
          "image": preparedData.image,
          "listVocabulary": [
            {
              "lessonID": currentLesson
            }
          ],
          "vocabulary": values.vocabulary,
          "voice_link": preparedData.voice_link
        })
        if (result.code === 200) {
          setVocabularyDataSource(vocabularyDataSource.map(row => {
            if (row.id === vocabularyModalContent.id) {
              return {
                ...row,
                ...values
              }
            }
            return row;
          }))
          console.log("success")
          setSomethingLoading(false)
          setVocabularyCreateModalVisible(false)
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
    createVocabulary();
  }

  const onConversationCreateFormFinish = async values => {
    const preparedData = {
      ...values,
      ...conversationCreateModalContent,
      id: currentLesson
    }
    async function createConversation() {
      try {
        const result = await request.post(`/api/admin/addConversation`, {
          "conversation": preparedData.conversation,
          "conversationImage": preparedData.image,
          "description": preparedData.description,
          "lessonID": currentLesson,
          "voice_link": preparedData.voice_link
        })
        if (result.code === 200) {
          setConverastionDataSource(conversationDataSource.map(row => {
            if (row.id === conversationModalContent.id) {
              return {
                ...row,
                ...values
              }
            }
            return row;
          }))
          console.log("success")
          setSomethingLoading(false)
          setConversationCreateModalVisible(false)
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
    createConversation();
  }

  const onLessonCreateFormFinish = async values => {

    const preparedData = {
      ...values,
      ...lessonCreateModalContent,
    }
    async function createLesson() {
      try {
        const result = await request.post(`/api/admin/createLesson`, {
          "lessonImage": preparedData.image,
          "lessonName": preparedData.lessonName,
          "levelID": preparedData.levelID
        })
        if (result.code === 200) {
          setDataSource(dataSource.map(row => {
            if (row.id === dataSource.id) {
              return {
                ...row,
                ...values
              }
            }
            return row;
          }))
          console.log("success")
          setSomethingLoading(false)
          setLessonCreateModalVisible(false)
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
    createLesson();
  }

  const onConverastionFormFinish = values => {
    setSomethingLoading(true)
    async function updateConversation() {
      try {
        const result = await request.put(`/api/admin/updateConversation`, {
          "conversation": values.conversation,
          "conversationImage": values.converastionImage,
          "description": values.description,
          "id": values.id,
          "lessonID": conversationModalContent.lessonID,
          "voice_link": values.voice_link
        })
        if (result.code === 200) {
          setConverastionDataSource(conversationDataSource.map(row => {
            if (row.id === conversationModalContent.id) {
              return {
                ...row,
                ...values
              }
            }
            return row;
          }))
          console.log("success")
          setSomethingLoading(false)
          setConversationUpdateModalVisible(false)
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
    updateConversation();
  }

  const onQuizFormFinish = values => {
    console.log(values)
    // setSomethingLoading(true)
    // async function updateQuiz() {
    //   try {
    //     const result = await request.put(`/api/admin/updateConversation`, {
    //       "conversation": values.conversation,
    //       "conversationImage": values.converastionImage,
    //       "description": values.description,
    //       "id": values.id,
    //       "lessonID": conversationModalContent.lessonID,
    //       "voice_link": values.voice_link
    //     })
    //     if (result.code === 200) {
    //       setConverastionDataSource(conversationDataSource.map(row => {
    //         if (row.id === conversationModalContent.id) {
    //           return {
    //             ...row,
    //             ...values
    //           }
    //         }
    //         return row;
    //       }))
    //       console.log("success")
    //       setSomethingLoading(false)
    //       setConversationUpdateModalVisible(false)
    //     } else {
    //       message.error({
    //         content: 'Something went wrong!',
    //         style: {
    //           position: 'fixed',
    //           bottom: '10px',
    //           left: '50%'
    //         }
    //       })
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
    // updateQuiz();
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt1M;
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleVocaImageChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setVocabularyCreateModalContent({
          ...vocabularyCreateModalContent,
          image: imageUrl
        })
      }
      );
    }
  }

  const handleLessonImageChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setLessonCreateModalContent({
          ...lessonCreateModalContent,
          image: imageUrl
        })
      }
      );
    }
  }

  const uploadImg = async (file) => {
    let identify = file.name + '__' + Date.now();
    let imgURL;
    await storage.ref(`image/${currentLesson.trim()}/Vocabulary/${identify}`).put(file);
    await storage.ref(`image/${currentLesson.trim()}/Vocabulary`).child(identify).getDownloadURL().then(url => {
      imgURL = url;
    })
    setVocabularyCreateModalContent({
      ...vocabularyCreateModalContent,
      image: imgURL
    })
    return imgURL
  }

  const uploadConversationImg = async (file) => {
    let identify = file.name + '__' + Date.now();
    let imgURL;
    await storage.ref(`image/${currentLesson.trim()}/Conversation/${identify}`).put(file);
    await storage.ref(`image/${currentLesson.trim()}/Conversation`).child(identify).getDownloadURL().then(url => {
      imgURL = url;
    })
    setConversationCreateModalContent({
      ...conversationCreateModalContent,
      image: imgURL
    })
    return imgURL
  }

  const uploadLessonImg = async (file) => {
    let identify = file.name + '__' + Date.now();
    let imgURL;
    await storage.ref(`image/L3_6/${identify}`).put(file);
    await storage.ref(`image/L3_6`).child(identify).getDownloadURL().then(url => {
      imgURL = url;
    })
    setLessonCreateModalContent({
      ...lessonCreateModalContent,
      image: imgURL
    })
    return imgURL
  }

  const uploadVoiceLink = async (file) => {
    let identify = file.name + '__' + Date.now();
    let voiceURL;
    await storage.ref(`voice/${currentLesson.trim()}/Vocabulary/${identify}`).put(file);
    await storage.ref(`voice/${currentLesson.trim()}/Vocabulary`).child(identify).getDownloadURL().then(url => {
      voiceURL = url;
    })
    setVocabularyCreateModalContent({
      ...vocabularyCreateModalContent,
      voice_link: voiceURL
    })
    return voiceURL
  }

  const uploadConversationVoiceLink = async (file) => {
    let identify = file.name + '__' + Date.now();
    let voiceURL;
    await storage.ref(`voice/${currentLesson.trim()}/Conversation/${identify}`).put(file);
    await storage.ref(`voice/${currentLesson.trim()}/Conversation`).child(identify).getDownloadURL().then(url => {
      voiceURL = url;
    })
    setConversationCreateModalContent({
      ...conversationCreateModalContent,
      voice_link: voiceURL
    })
    return voiceURL
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
            <Button onClick={showLessonCreateModal} type="text" style={{ border: 'none', color: 'blue', marginBottom: '20px', marginLeft: '0' }} size={"large"}>
              <PlusOutlined />Add new lesson
            </Button>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                position: ['topRight', 'bottomRight'],
                pageSize: 10
              }}
            />
            <Modal
              visible={isLessonCreateModalVisible}
              width={900}
              title="Create new Lesson"
              onCancel={() => {
                setLessonCreateModalContent({})
                setLessonCreateModalVisible(false)
              }}
              footer={[
                <Button
                  key="submit"
                  form="lessonCreateForm"
                  default
                  loading={isSomethingLoading}
                  htmlType="submit"
                >
                  Create
              </Button>
              ]}
            >
              <div
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
              >
                <Form
                  id="lessonCreateForm"
                  name="lessonCreateForm"
                  onFinish={onLessonCreateFormFinish}
                  onFinishFailed={(e) => console.log(e)}
                >
                  <h3>Lesson Name</h3>
                  <Form.Item
                    name="lessonName"
                    rules={[{ required: true, message: 'This field is required!' }]}
                  >
                    <Input placeholder="Lesson Name" />
                  </Form.Item>
                  <h3>Level</h3>
                  <Form.Item
                    name="levelID"
                    initialValue={currentLevel}
                    rules={[{ required: true, message: 'This field is required!' }]}
                  >
                    <Input disabled />
                  </Form.Item>
                  <h3>Lesson Image</h3>
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    action={uploadLessonImg}
                    beforeUpload={beforeUpload}
                    onChange={handleLessonImageChange}
                  >
                    {
                      lessonCreateModalContent.image ? <img src={lessonCreateModalContent.image} style={{ width: '100%' }} alt={lessonCreateModalContent.image} /> :
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    }
                  </Upload>
                </Form>
              </div>
            </Modal>

            <Modal
              visible={isModalVisible}
              width={1200}
              onCancel={() => {
                setModalVisible(false)
                setVocabularyDataSource([])
                setQuizDataSource([])
                setConverastionDataSource([])
              }}
              footer={[
              ]}
            >
              <div
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
              >
                <Tabs defaultActiveKey="tabVocabulary">
                  <TabPane tab="Vocabulary" key="tabVocabulary">
                    {
                      vocabularyDataSource.length > 0 ?
                        <>
                          <Button onClick={showVocabularyCreateModal} type="text" style={{ border: 'none', color: 'blue', marginBottom: '20px', marginLeft: '0' }} size={"large"}>
                            <PlusOutlined />Add new vocabulary
                         </Button>
                          <Row justify="center">
                            <Table
                              dataSource={vocabularyDataSource}
                              columns={vocabularyColumn}
                              pagination={{
                                position: ['bottomRight'],
                                pageSize: 10
                              }}
                              style={{ width: '98%' }}
                            />
                            <Modal
                              visible={isVocabularyCreateModalVisible}
                              width={900}
                              title="Create new vocabulary"
                              onCancel={() => {
                                setVocabularyCreateModalContent({})
                                setVocabularyCreateModalVisible(false)
                              }}
                              footer={[
                                <Button
                                  key="submit"
                                  form="vocaCreateForm"
                                  default
                                  loading={isSomethingLoading}
                                  htmlType="submit"
                                >
                                  Create
                              </Button>
                              ]}
                            >
                              <div
                                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                              >
                                <Form
                                  id="vocaCreateForm"
                                  name="vocaCreateForm"
                                  onFinish={onVocabularyCreateFormFinish}
                                  onFinishFailed={(e) => console.log(e)}
                                >
                                  <h3>Vocabulary</h3>
                                  <Form.Item
                                    name="vocabulary"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                  >
                                    <Input placeholder="vocabulary" />
                                  </Form.Item>
                                  <h3>Vocabulary Description</h3>
                                  <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                  >
                                    <Input placeholder="description" />
                                  </Form.Item>
                                  <h3>Vocabulary Voice</h3>
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadVoiceLink}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      vocabularyCreateModalContent.voice_link ? <audio key={vocabularyCreateModalContent.voice_link} controls><source src={vocabularyModalContent.voice_link} type="audio/mpeg" /></audio> :
                                        <div>
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    }
                                  </Upload>
                                  <h3>Vocabulary Image</h3>
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadImg}
                                    beforeUpload={beforeUpload}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      vocabularyCreateModalContent.image ? <img src={vocabularyCreateModalContent.image} style={{ width: '100%' }} alt={vocabularyCreateModalContent.image} /> :
                                        <div>
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    }
                                  </Upload>
                                </Form>
                              </div>
                            </Modal>
                            <Modal
                              visible={isVocabularyUpdateModalVisible}
                              width={900}
                              onCancel={() => {
                                setVocabularyUpdateModalVisible(false)
                              }}
                              footer={[
                                <Button
                                  key="submit"
                                  form="vocaForm"
                                  default
                                  loading={isSomethingLoading}
                                  htmlType="submit"
                                >
                                  Submit
                              </Button>
                              ]}
                            >
                              <div
                                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                              >
                                <Form
                                  id="vocaForm"
                                  name="vocaForm"
                                  form={vocaForm}
                                  onFinish={onVocabularyFormFinish}
                                  onFinishFailed={(e) => console.log(e)}
                                >
                                  <h3>Vocabulary ID</h3>
                                  <Form.Item
                                    name="id"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={vocabularyModalContent.id}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                  <h3>Vocabulary</h3>
                                  <Form.Item
                                    name="vocabulary"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={vocabularyModalContent.vocabulary}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <h3>Description</h3>
                                  <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={vocabularyModalContent.description}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <h3>Vocabulary Image</h3>
                                  {/* <Form.Item
                                    name="image"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={vocabularyModalContent.image}
                                  >
                                    <Image src={vocabularyModalContent.image} width={300} height={300} />
                                  </Form.Item> */}
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadImg}
                                    beforeUpload={beforeUpload}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      vocabularyCreateModalContent.image ? <img src={vocabularyCreateModalContent.image} style={{ width: '100%' }} alt={vocabularyCreateModalContent.image} /> :
                                        <div>

                                          <div style={{ marginTop: 20 }}>
                                            <img src={vocabularyModalContent.image} style={{ width: '100%' }} />
                                          </div>
                                        </div>
                                    }
                                  </Upload>
                                  <h3 style={{ marginTop: 20 }}>Vocabulary Voice</h3>
                                  {/* <Form.Item
                                    name="voice_link"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={vocabularyModalContent.voice_link}
                                  >
                                    <audio key={vocabularyModalContent.id} controls><source src={vocabularyModalContent.voice_link} type="audio/mpeg" /></audio>
                                  </Form.Item> */}
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadVoiceLink}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      vocabularyCreateModalContent.voice_link ? <audio key={vocabularyCreateModalContent.voice_link} controls><source src={vocabularyCreateModalContent.voice_link} type="audio/mpeg" /></audio> :
                                        <div >
                                          <div style={{ marginTop: 8, width: 60 }}>
                                            <audio key={vocabularyModalContent.voice_link} controls><source src={vocabularyModalContent.voice_link} type="audio/mpeg" /></audio>
                                          </div>
                                        </div>
                                    }
                                  </Upload>
                                </Form>
                              </div>
                            </Modal>
                          </Row>
                        </> :
                        <Row justify="center" align="middle" style={{ width: '100%', height: '100%' }}>
                          <Space size="middle">
                            <Spin size="large" />
                          </Space>
                        </Row>
                    }
                  </TabPane>
                  <TabPane tab="Conversation" key="tabConversation">
                    {
                      conversationDataSource.length > 0 ?
                        <>
                          <Button onClick={showConversationCreateModal} type="text" style={{ border: 'none', color: 'blue', marginBottom: '20px', marginLeft: '0' }} size={"large"}>
                            <PlusOutlined />Add new conversation
                          </Button>
                          <Row justify="center">

                            <Table
                              dataSource={conversationDataSource}
                              columns={conversationColumn}
                              pagination={{
                                position: ['bottomRight'],
                                pageSize: 10
                              }}
                            />
                            <Modal
                              visible={isConversationCreateModalVisible}
                              width={900}
                              title="Create new converastion"
                              onCancel={() => {
                                setConversationCreateModalContent({})
                                setConversationCreateModalVisible(false)
                              }}
                              footer={[
                                <Button
                                  key="submit"
                                  form="conversationCreateForm"
                                  default
                                  loading={isSomethingLoading}
                                  htmlType="submit"
                                >
                                  Create
                              </Button>
                              ]}
                            >
                              <div
                                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                              >
                                <Form
                                  id="conversationCreateForm"
                                  name="conversationCreateForm"
                                  onFinish={onConversationCreateFormFinish}
                                  onFinishFailed={(e) => console.log(e)}
                                >
                                  <h3>Conversation</h3>
                                  <Form.Item
                                    name="conversation"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                  >
                                    <Input placeholder="Conversation" />
                                  </Form.Item>
                                  <h3>Conversation Description</h3>
                                  <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                  >
                                    <Input placeholder="Conversation Description" />
                                  </Form.Item>
                                  <h3>Conversation Voice</h3>
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadConversationVoiceLink}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      conversationCreateModalContent.voice_link ? <audio key={conversationCreateModalContent.voice_link} controls><source src={conversationModalContent.voice_link} type="audio/mpeg" /></audio> :
                                        <div>
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    }
                                  </Upload>
                                  <h3>Conversation Image</h3>
                                  <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action={uploadConversationImg}
                                    beforeUpload={beforeUpload}
                                    onChange={handleVocaImageChange}
                                  >
                                    {
                                      conversationCreateModalContent.image ? <img src={conversationCreateModalContent.image} style={{ width: '100%' }} alt={conversationCreateModalContent.image} /> :
                                        <div>
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    }
                                  </Upload>
                                </Form>
                              </div>
                            </Modal>
                            <Modal
                              visible={isConversationUpdateModalVisible}
                              width={900}
                              onCancel={() => {
                                setConversationUpdateModalVisible(false)
                              }}
                              footer={[
                                <Button
                                  key="submit"
                                  form="conversationForm"
                                  default
                                  loading={isSomethingLoading}
                                  htmlType="submit"
                                >
                                  Submit
                          </Button>
                              ]}
                            >
                              <div
                                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                              >
                                <Form
                                  id="conversationForm"
                                  name="conversationForm"
                                  form={conversationForm}
                                  onFinish={onConverastionFormFinish}
                                  onFinishFailed={(e) => console.log(e)}
                                >
                                  <h3>Conversation ID</h3>
                                  <Form.Item
                                    name="id"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={conversationModalContent.id}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                  <h3>Conversation</h3>
                                  <Form.Item
                                    name="conversation"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={conversationModalContent.conversation}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <h3>Description</h3>
                                  <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={conversationModalContent.description}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <h3>Conversation Voice</h3>
                                  <Form.Item
                                    name="voice_link"
                                    rules={[{ required: true, message: 'This field is required!' }]}
                                    initialValue={conversationModalContent.voice_link}
                                  >
                                    <audio key={conversationModalContent.id} controls><source src={conversationModalContent.voice_link && `https://drive.google.com/uc?export=download&id=${conversationModalContent.voice_link.split('/').reverse()[1]}`} type="audio/mpeg" /></audio>
                                  </Form.Item>
                                </Form>
                              </div>
                            </Modal>
                          </Row>
                        </>
                        :
                        <Row justify="center" align="middle" style={{ width: '100%', height: '100%' }}>
                          <Space size="middle">
                            <Spin size="large" />
                          </Space>
                        </Row>
                    }
                  </TabPane>
                  <TabPane tab="Quiz" key="tabQuiz">
                    {/* {
                      quizDataSource.length > 0 ? */}
                    <Row justify="center">
                      <Button onClick={showQuizDropDownCreateModal} type="text" style={{ border: 'none', color: 'blue', marginBottom: '20px', marginLeft: '0' }} size={"large"}>
                        <PlusOutlined />Add new question
                      </Button>
                      <Table
                        dataSource={quizDataSource}
                        columns={quizColumn}
                        pagination={{
                          position: ['bottomRight'],
                          pageSize: 10
                        }}
                      />
                      <Modal
                        visible={isDropDownCreateModalVisible}
                        width={900}
                        title="Choose Question Type"
                        onCancel={() => {
                          setDropDownCreateModalVisible(false)
                        }}
                        footer={[
                          <Button
                            key="submit"
                            form="conversationCreateForm"
                            default
                            loading={isSomethingLoading}
                            htmlType="submit"
                          >
                          </Button>
                        ]}
                      >
                        <Dropdown overlay={menu} trigger={['click']}>
                          <Button>
                            Choose Quiz Type <DownOutlined />
                          </Button>
                        </Dropdown>
                      </Modal>
                      <Modal
                        visible={isQuizUpdateModalVisible}
                        title="Update Quiz"
                        width={900}
                        onCancel={() => {
                          setQuizUpdateModalVisible(false)
                        }}
                        footer={[
                          <Button
                            key="submit"
                            form="quizForm"
                            default
                            loading={isSomethingLoading}
                            htmlType="submit"
                          >
                            Submit
                          </Button>
                        ]}
                      >
                        <div
                          style={{ maxHeight: '60vh', overflowY: 'auto' }}
                        >
                          <Form
                            id="quizForm"
                            name="quizForm"
                            form={quizForm}
                            onFinish={onQuizFormFinish}
                            onFinishFailed={(e) => console.log(e)}
                          >
                            <h3>Question ID</h3>
                            <Form.Item
                              name="questionID"
                              rules={[{ required: true, message: 'This field is required!' }]}
                              initialValue={quizModalContent.questionID}
                            >
                              <Input disabled />
                            </Form.Item>
                            <h3>Question </h3>
                            <Form.Item
                              name="question"
                              rules={[{ required: true, message: 'This field is required!' }]}
                              initialValue={quizModalContent.question}
                            >
                              {
                                (quizModalContent.quizType === 1) ?
                                  <Input /> :
                                  (quizModalContent.quizType === 2) ?
                                    <audio key={quizModalContent.questionID} controls><source src={quizModalContent.question && `https://drive.google.com/uc?export=download&id=${quizModalContent.question.split('/').reverse()[1]}`} type="audio/mpeg" /></audio> :
                                    (quizModalContent.quizType === 3) ?
                                      <Image src={quizModalContent && `https://drive.google.com/thumbnail?id=${quizModalContent.question.split('/').reverse()[1]}`} width={300} height={300} />
                                      : <Input />
                              }
                            </Form.Item>
                            <h3>Quiz ID</h3>
                            <Form.Item
                              name="quizID"
                              rules={[{ required: true, message: 'This field is required!' }]}
                              initialValue={quizModalContent.quizID}
                            >
                              <Input disabled />
                            </Form.Item>
                            <h3>Quiz type</h3>
                            <Form.Item
                              name="quizType"
                              rules={[{ required: true, message: 'This field is required!' }]}
                              initialValue={quizModalContent.quizType}
                            >
                              <Input disabled />
                            </Form.Item>
                            {
                              quizModalContent.options && quizModalContent.options.map((option, index) => <div key={option.optionID}>
                                <h3>Answer {index + 1}  </h3>
                                <Form.Item
                                  name={`option_${index + 1}`}
                                  rules={[{ required: true, message: 'This field is required!' }]}
                                  initialValue={option.optionName}
                                >
                                  <Input />
                                </Form.Item>
                              </div>)
                            }
                          </Form>
                        </div>
                      </Modal>
                    </Row>
                    {/* : */}
                    {/* <Row justify="center" align="middle" style={{ width: '100%', height: '100%' }}>
                          <Space size="middle">
                            <Spin size="large" />
                          </Space>
                        </Row> */}
                    {/* } */}
                  </TabPane>
                </Tabs>
              </div>
            </Modal>
          </Row>
      }
    </>
  )
}
export default connect(state => ({
}), dispatch => ({
}))(LessonsView)
