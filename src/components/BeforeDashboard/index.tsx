import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { DemoButton } from './DemoButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Your real estate website is ready</h4>
      </Banner>
      <ol className={`${baseClass}__instructions`}>
        <li>
          <DemoButton /> to fill the site with 8 example properties, 4 agents and photos. Delete them whenever you like.
        </li>
        <li>
          Open <a href="/admin/globals/site-settings">Site Settings</a> to choose one of the 4 designs, and set your agency name, logo, colours and contact details.
        </li>
        <li>
          Add your own <a href="/admin/collections/agents">agents</a> and <a href="/admin/collections/properties">properties</a>. Leads arrive in <a href="/admin/collections/enquiries">Enquiries</a> and <a href="/admin/collections/viewings">Viewings</a> and are emailed to the agent.
        </li>
        <li>
          <a href="/" target="_blank" rel="noopener noreferrer">View your website</a>
        </li>
      </ol>
    </div>
  )
}

export default BeforeDashboard
