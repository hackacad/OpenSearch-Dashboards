/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { download, GlobalTask } from '../../lib';
import { getNodeShasums } from './node_shasums';
import { getNodeDownloadInfo } from './node_download_info';

export const DownloadNodeBuilds: GlobalTask = {
  global: true,
  description: 'Downloading node.js builds for all platforms',
  async run(config, log) {
    const shasums = await getNodeShasums(log, config.getNodeVersion());
    await Promise.all(
      config.getTargetPlatforms().map(async (platform) => {
        const { url, downloadPath, downloadName } = getNodeDownloadInfo(config, platform);
        await download({
          log,
          url,
          sha256: shasums[downloadName],
          destination: downloadPath,
          retries: 3,
        });
      })
    );
  },
};
