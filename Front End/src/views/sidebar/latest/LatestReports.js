import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
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
  CBadge,
} from '@coreui/react'
import { useHistory, useLocation } from 'react-router-dom'

const LatestReports = () => {
  const location = useLocation()
  const [reportsData, SetReportsData] = useState({})
  // fetching data from data analysis service for reports
  const getReports = () => {
    // event.preventDefault()

    fetch('http://127.0.0.1:8082/dataAnalysis/getReports')
      .then((res) => res.json())
      .then((data) => {
        SetReportsData(data)
      })
    console.log('in function')
  }
  function goToDetails(
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
    attackPattern,
  ) {
    history.push('/Report', {
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
      attackPattern: attackPattern,
    })
  }
  const history = useHistory()
  var isVulnerability = false
  var isMalware = false
  var isLocation = false
  var isThreatActor = false
  var isIdentitites = false
  var isTools = false
  var isInfra = false
  var isCampaign = false
  var isAttackPattern = false

  function setTags(
    malwares,
    vulnerabilities,
    locations,
    threatActors,
    identities,
    tools,
    infrastructure,
    campaigns,
    attackPattern,
  ) {
    if (malwares) {
      isMalware = true
    }
    if (vulnerabilities) {
      isVulnerability = true
    }
    if (threatActors) {
      isThreatActor = true
    }
    if (locations) {
      isLocation = true
    }
    if (identities) {
      isIdentitites = true
    }
    if (tools) {
      isTools = true
    }
    if (infrastructure) {
      isInfra = true
    }
    if (campaigns) {
      isCampaign = true
    }
    if (attackPattern) {
      isAttackPattern = true
    }
  }
  useEffect(() => {
    getReports()
    return () => {
      console.log('returning -xyzzz')
    }
  }, [location])
  return (
    <>
      {/* {getReports()} */}
      <CCard className="mb-4">
        <CCardHeader>ThreatGator&apos;s Latest Reports</CCardHeader>

        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                {/*<CTableHeaderCell className="text-center">*/}
                {/*<CIcon icon={cilPeople} />*/}
                {/*</CTableHeaderCell>*/}
                <CTableHeaderCell className="text-center">Raw text</CTableHeaderCell>
                <CTableHeaderCell className="text-center">tags</CTableHeaderCell>

                <CTableHeaderCell className="text-center"> </CTableHeaderCell>
                <CTableHeaderCell className="text-center"> </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Object.values(reportsData).map((el) => (
                <CTableRow key={el}>
                  <CTableDataCell>
                    <div className="rawText">{el.rawText}</div>
                  </CTableDataCell>
                  <CTableDataCell className="tags">
                    {(isVulnerability = false)}
                    {(isMalware = false)}
                    {(isLocation = false)}
                    {(isThreatActor = false)}
                    {(isIdentitites = false)}
                    {(isTools = false)}
                    {(isInfra = false)}
                    {(isCampaign = false)}
                    {(isAttackPattern = false)}
                    {setTags(
                      el.malwares,
                      el.vulnerabilities,
                      el.locations,
                      el.threatActors,
                      el.identities,
                      el.tools,
                      el.infrastructure,
                      el.campaigns,
                      el.attackPattern,
                    )}
                    {/*vulnerability tag*/}
                    {isVulnerability ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#85BFC5' }}
                      >
                        vulnerability
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if malware then malware tag*/}
                    {isMalware ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#ea8e8e' }}
                      >
                        malware
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if locations tag*/}
                    {isLocation ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#9A8BF3' }}
                      >
                        locations
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if threat actor tag*/}
                    {isThreatActor ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#FA714A' }}
                      >
                        threatActors
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if identitites tag*/}
                    {isIdentitites ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#6AC267' }}
                      >
                        identities
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if tools tag*/}
                    {isTools ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#D2B6B2' }}
                      >
                        tools
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if infra tag*/}
                    {isInfra ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#B6BF7A' }}
                      >
                        infra
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if campaign tag*/}
                    {isCampaign ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#F39E29' }}
                      >
                        campaigns
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                    {/*if attack pattern tag*/}
                    {isAttackPattern ? (
                      <CBadge
                        className="rounded-pill"
                        style={{ margin: '1%', backgroundColor: '#BF749B' }}
                      >
                        attack-Pattern
                      </CBadge>
                    ) : (
                      <div></div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      style={{ backgroundColor: 'blue', margin: '1%' }}
                      onClick={() =>
                        goToDetails(
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
                          el.attackPattern,
                        )
                      }
                    >
                      Details
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="text-center"></CTableDataCell>

                  {/*  <CTableRow key={el}>*/}
                  {/*    <CTableDataCell>{el.source}</CTableDataCell>*/}
                  {/*    <CTableDataCell>{el.malwares}</CTableDataCell>*/}
                  {/*    <CTableDataCell>{el.vulnerabilities}</CTableDataCell>*/}
                  {/*    <CTableDataCell>{el.locations}</CTableDataCell>*/}
                  {/*    <CTableDataCell>{el.threatActors}</CTableDataCell>*/}
                  {/*    /!*<CTableDataCell>{el.identities}</CTableDataCell>*!/*/}
                  {/*    /!*<CTableDataCell>{el.tools}</CTableDataCell>*!/*/}
                  {/*    /!*<CTableDataCell>{el.infrastructure}</CTableDataCell>*!/*/}
                  {/*    /!*<CTableDataCell>{el.campaigns}</CTableDataCell>*!/*/}
                  {/*  </CTableRow>*/}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default LatestReports
