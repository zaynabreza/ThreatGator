import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAvatar,
  CProgress,
  CTable,
  CButton,
  CCardTitle,
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilPeople,
} from '@coreui/icons'
import { useHistory, useLocation } from 'react-router-dom'
import Heart from 'react-heart'
import ReactSpeedometer from 'react-d3-speedometer'
import Visualizer from '../visualizer/visualizer'

const NotificationsDetails = () => {
  const [FieldsData, SetFieldsData] = useState({})
  var history = useHistory()
  const [reportsData, SetReportsData] = useState({})
  var [hash1, SetHash] = useState({})
  const [active, setActive] = useState(false)
  const [threatScore, SetThreatScore] = useState('')
  var mergedReports = []
  var [relatedReportData, setRelatedReportData] = useState([])
  // var [mergedReports, SetMergedReports] = useState([])
  // fetching data from data analysis service for reports
  const location = useLocation()
  const hash = location.state.hash
  // const org_id=location.state.org_id
  // const mergedReportsBundles = []
  var [mergedReportsBundles, setMergedReportsBundles] = useState([])
  var [objectMergedReport, setObjectMergedReport] = useState({})
  const relatedLinks = []
  console.log('hash' + hash)
  const data1 = { org_id: location.state.org_id, reportId: hash, index: 'tagged_bundle_data' }
  const get_notif = (event) => {
    // fetch('http://127.0.0.1:8082/dataAnalysis/getResultOnHash', location.state.requestOptions)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('recv ', data)
    //     SetFieldsData(data)
    //   })
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    var raw = JSON.stringify({
      hash: hash,
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }
    var x = fetch('http://127.0.0.1:8082/dataAnalysis/getResultOnHash', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('recv ', data)
        SetFieldsData(data)
      })
      .catch((error) => console.log('error', error))
  }
  // const location = useLocation()
  function getScore() {
    // return null
    // const data1 = { org_id: location.state.org_id, reportId: hash, index: 'tagged_bundle_data' }

    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'text/plain')

    // var raw = '{   "org_id":2\n    "report_id":-1138549715\n    "index":"tagged_data_bundle"}'

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: data1,
      redirect: 'follow',
    }

    fetch(
      'http://127.0.0.1:8086/threatScore/getThreatScoreByOrganizationReport?org_id=' +
        encodeURIComponent(data1.org_id) +
        '&report_id=' +
        encodeURIComponent(data1.reportId) +
        '&index=' +
        encodeURIComponent(data1.index),
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => SetThreatScore(result))
      .catch((error) => console.log('error', error))
  }

  function goToDetails(
    hash,
    source,
    rawtext,
    malwares,
    vulnerabilities,
    locations,
    threatActors,
    identities,
    tools,
    infrastructure,
    campaigns,
    attackPatterns,
  ) {
    history.push('/Report', {
      hash: hash,
      source: source,
      rawText: rawtext,
      malware: malwares,
      vulnerabilities: vulnerabilities,
      locations: locations,
      threatActors: threatActors,
      identities: identities,
      tools: tools,
      infrastructure: infrastructure,
      campaigns: campaigns,
      attackPatterns: attackPatterns,
      org_id: data1.org_id,
    })
    window.location.reload(true)
  }

  async function getStix() {
    console.log('getting stix')

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    var x = await fetch(
      'http://127.0.0.1:8086/threatScore/filterStixBundle/?org_id=' +
        encodeURIComponent(data1.org_id) +
        '&report_id=' +
        encodeURIComponent(data1.reportId) +
        '&index=' +
        encodeURIComponent(data1.index),
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        SetHash(result)
        // hash1 = result
        getMergedReports()
      })
      .catch((error) => console.log('error', error))

    // SetHash(JSON.parse(JSON.stringify(hash1)))
    // getMergedReports()
  }
  async function getMergedReports() {
    console.log('Merged called')
    //  get merged reports
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    var raw = JSON.stringify({
      hash: hash,
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    }

    var x = await fetch('http://127.0.0.1:8082/dataAnalysis/getRelatedReports', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        mergedReports = result
        console.log('Merged', mergedReports)
        split()
      })
      .catch((error) => console.log('error', error))
  }
  async function split() {
    console.log('Split called')
    if (mergedReports != []) {
      var temp = new Object()
      temp.merged = []
      var temp2 = []
      for (var i = 0; i < mergedReports.length; i++) {
        if (mergedReports[i].index === 'stix') {
          console.log(mergedReports[i])
          var y = await fetch(
            'http://127.0.0.1:8082/dataAnalysis/getStixBundle/' +
              mergedReports[i].id +
              '/' +
              mergedReports[i].index,
          )
            .then((res) => res.json())
            .then((data) => {
              setMergedReportsBundles(data)
              temp.merged.push(data)
              console.log(temp)

              // Object.assign(objectMergedReport, mergedReportsBundles)
              // mergedReportsBundles.push(data)
              // console.log(mergedReportsBundles)
            })
        } else if (mergedReports[i].index == 'tagged_bundle_data') {
          //   console.log('tagged bundle data')
          //   fetch(
          //     'http://127.0.0.1:8082/dataAnalysis/getStixBundle/' +
          //       mergedReports[i].id +
          //       '/' +
          //       mergedReports[i].index,
          //   )
          //     .then((res) => res.json())
          //     .then((data) => {
          //       relatedLinks.push(data)
          //       console.log(relatedLinks)
          //     })
          // }
          var myHeaders = new Headers()
          myHeaders.append('Content-Type', 'application/json')
          var raw = JSON.stringify({
            hash: mergedReports[i].id,
          })
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          }
          var x = await fetch('http://127.0.0.1:8082/dataAnalysis/getResultOnHash', requestOptions)
            .then((response) => response.text())
            .then((data) => {
              temp2.push(JSON.parse(data))

              console.log(temp2)
            })
            .catch((error) => console.log('error', error))
        }
      }
      setObjectMergedReport(temp)
      setRelatedReportData(temp2)
    }
    console.log('merged reports!!!! ' + mergedReportsBundles)
    console.log('Related links ' + relatedLinks)
  }
  function addToFavorites() {
    console.log('bookmarking for user ', location.state.userid)
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    var raw = JSON.stringify({
      userId: location.state.userid,
      reportHash: hash,
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch('http://127.0.0.1:8084/users/toggleBookmark', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }
  function checkBookmark() {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    var raw = JSON.stringify({
      userId: parseInt(location.state.userid),
      reportHash: hash,
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch('http://127.0.0.1:8084/users/checkBookmark', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('check bookmark', result)
        setActive(result)
      })
      .catch((error) => console.log('error', error))
  }
  function goBack() {
    if (location.state.src == 'bookmarks') {
      history.push('/bookmarks', { org_id: location.state.org_id, userid: location.state.userid })
    } else if (location.state.src == 'latestReports') {
      history.push('/latestReports', {
        org_id: location.state.org_id,
        userid: location.state.userid,
      })
    } else if (location.state.src == 'dashboard') {
      history.push('/dashboard', {
        org_id: location.state.org_id,
        userid: location.state.userid,
      })
    }
  }
  useEffect(() => {
    get_notif()
    getStix()
    getScore()
    checkBookmark()
    // const el = ref.current.parentNode.firstChild
    // const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    // setColor(varColor)
  }, [])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <b> Report Details: {FieldsData.time}</b>
          <CButton onClick={() => goBack()} style={{ float: 'right' }}>
            Return
          </CButton>
        </CCardHeader>
        <CCardBody>
          {/*Raw text*/}
          <CCard>
            <CCardBody>
              <CCardTitle>
                <b>Report</b>
                <div className="d-flex justify-content-center" style={{ float: 'right' }}>
                  <h6>Add to Favourites </h6>
                  <div
                    style={{
                      width: '1.5rem',
                      float: 'right',
                      marginLeft: '0.5rem',
                      marginBottom: '2rem',
                    }}
                  >
                    {/*<p>Add to Favourites</p>*/}
                    <Heart
                      isActive={active}
                      onClick={() => {
                        setActive(!active)
                        addToFavorites()
                      }}
                    />
                  </div>
                </div>
              </CCardTitle>
              {
                <div className="rawText" style={{ height: '150px' }}>
                  {FieldsData.rawText}
                </div>
              }
            </CCardBody>
          </CCard>
          {<br></br>}
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                {FieldsData.source ? (
                  <CTableHeaderCell className="text-center">Source</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.malware ? (
                  <CTableHeaderCell className="text-center">Malware</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.vulnerabilities ? (
                  <CTableHeaderCell className="text-center">Vulnerabilities</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.location ? (
                  <CTableHeaderCell className="text-center">Location</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.threatActors ? (
                  <CTableHeaderCell className="text-center">ThreatActors</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.identities ? (
                  <CTableHeaderCell className="text-center">Identities</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.tools ? (
                  <CTableHeaderCell className="text-center">Tools</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.infrastructure ? (
                  <CTableHeaderCell className="text-center">Infrastructure</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.campaigns ? (
                  <CTableHeaderCell className="text-center">Campaigns</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.attackPatterns ? (
                  <CTableHeaderCell className="text-center">Attack-Pattern</CTableHeaderCell>
                ) : (
                  console.log('-')
                )}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                {FieldsData.source ? (
                  <CTableDataCell className="text-center">{FieldsData.source}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.malware ? (
                  <CTableDataCell className="text-center">{FieldsData.malware}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.vulnerabilities ? (
                  <CTableDataCell className="text-center">
                    {FieldsData.vulnerabilities}
                  </CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.location ? (
                  <CTableDataCell className="text-center">{FieldsData.locations}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.threatActors ? (
                  <CTableDataCell className="text-center">{FieldsData.threatActors}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.identities ? (
                  <CTableDataCell className="text-center">{FieldsData.identities}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.tools ? (
                  <CTableDataCell className="text-center">{FieldsData.tools}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.infrastructure ? (
                  <CTableDataCell className="text-center">
                    {FieldsData.infrastructure}
                  </CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.campaigns ? (
                  <CTableDataCell className="text-center">{FieldsData.campaigns}</CTableDataCell>
                ) : (
                  console.log('-')
                )}
                {FieldsData.attackPatterns ? (
                  <CTableDataCell className="text-center">
                    {FieldsData.attackPatterns}
                  </CTableDataCell>
                ) : (
                  console.log('-')
                )}
              </CTableRow>
            </CTableBody>
          </CTable>
          {/*<div>*/}
          {/*  <p>Threat Score: {threatScore}</p>*/}
          {/*</div>*/}
          <div className="d-flex justify-content-center">
            <ReactSpeedometer
              needleHeightRatio={0.8}
              maxSegmentLabels={10}
              segments={3333}
              value={threatScore}
              // needleColor="000"
              // textColor="#FFF"
              maxValue={1}
              minValue={0}
              forceRender={false}
              startColor="#33CC33"
              endColor="#FF471A"
              currentValueText={'Threat Score: ' + JSON.stringify(threatScore)}
              height={190}
              paddingVertical={10}
            />
          </div>
          <div>
            STIX Visualizer
            {hash1 && mergedReportsBundles ? (
              <Visualizer graph1={hash1} graph2={objectMergedReport} />
            ) : (
              //   console.log('Hash1 is: ' + JSON.parse(JSON.stringify(hash1)))
              console.log('Visualizer not called')
            )}
          </div>
          <div>
            Related Links
            {/*  Adding related links */}
            {console.log(relatedReportData)}
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableBody>
                {Object.values(relatedReportData).map((el) => (
                  <CTableRow key={el}>
                    <CTableDataCell>
                      <div>{el.rawText.slice(0, 100) + '...'}</div>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <CButton
                        style={{ backgroundColor: 'blue', margin: '1%' }}
                        onClick={() =>
                          goToDetails(
                            el.hash,
                            el.source,
                            el.rawText,
                            el.malwares,
                            el.vulnerabilities,
                            el.locations,
                            el.threatActors,
                            el.identities,
                            el.tools,
                            el.infrastructure,
                            el.campaigns,
                            el.attackPatterns,
                          )
                        }
                      >
                        Details
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>

                  // <CDropdownItem onClick={() => handleSelect(el)} key={el}>
                  //   Report: {i + 1}
                  // </CDropdownItem>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default NotificationsDetails
