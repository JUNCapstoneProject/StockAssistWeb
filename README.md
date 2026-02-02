# <img src="https://github.com/user-attachments/assets/89ea6ed2-7a5b-48d3-87c0-94ef58591967" width="24" height="24" style="vertical-align: middle;" alt="Tuzain logo" /> Tuzain - AI를 활용한 주식 투자 보조 웹앱
## 서비스 소개

**복잡한 분석 대신, AI로 더 쉽게 투자 판단을 하세요.**  
Tuzain은 빠르게 변하는 주식 시장에서 필요한 정보를  
AI 분석을 통해 한눈에 이해할 수 있도록 돕는 주식 투자 보조 웹앱입니다.

차트, 재무제표, 뉴스 등 흩어진 정보를 직접 해석하는 대신  
AI가 핵심만 정리해 제공해, 투자 판단에 집중할 수 있도록 지원합니다.

**데이터 기반 의사결정을 돕는 AI 투자 파트너, Tuzain이  
여러분의 합리적인 투자를 함께 만들어갑니다.**
##

<h2>🛠 기술 스택</h2>

<table width="100%">
<tr>
<td valign="top" width="50%">

<h3>🌐 Frontend</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>Language</td><td>JavaScript</td></tr>
<tr><td>Framework</td><td>React</td></tr>
<tr><td>State Management</td><td>Redux</td></tr>
<tr><td>Styling</td><td>Styled-components</td></tr>
<tr><td>HTTP Client</td><td>Axios</td></tr>
<tr><td>Build Tool</td><td>Vite</td></tr>
<tr><td>Lint / Format</td><td>ESLint</td></tr>
</table>

</td>
<td valign="top" width="50%">

<h3>🖥 Backend</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>Language</td><td>Java, Python</td></tr>
<tr><td>Framework</td><td>Spring Boot</td></tr>
<tr><td>Build Tool</td><td>Gradle, Maven</td></tr>
<tr><td>ORM / Persistence</td><td>JPA</td></tr>
<tr><td>Database</td><td>MySQL</td></tr>
<tr><td>Cache / In-Memory DB</td><td>Redis</td></tr>
<tr><td>Auth / Security</td><td>JWT</td></tr>
<tr><td>API</td><td>RESTful API</td></tr>
<tr><td>Test</td><td>JUnit, Mockito, pytest</td></tr>
</table>

</td>
</tr>
</table>

<table width="100%">
<tr>
<td valign="top" width="50%">

<h3>🤖 AI / Analysis</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>Language</td><td>Python</td></tr>
<tr><td>NLP Model</td><td>RoBERTa</td></tr>
<tr><td>Semantic Analysis</td><td>SRL (Semantic Role Labeling)</td></tr>
<tr><td>Dependency Parsing</td><td>SDPG (Semantic Dependency Parsing Graph)</td></tr>
<tr><td>Sentiment Analysis</td><td>뉴스 감성 분류 (Positive / Neutral / Negative)</td></tr>
<tr><td>Quantitative Model</td><td>Fama-French 5-Factor 기반 FF5-News 확장 모델</td></tr>
<tr><td>Time Series Model</td><td>LSTM, CuDNNLSTM</td></tr>
<tr><td>Financial Features</td><td>재무제표 기반 정량 지표 (ROE, PER 등)</td></tr>
<tr><td>Data Fusion</td><td>뉴스(정성) + 재무·주가(정량) 데이터 융합</td></tr>
<tr><td>Experiment / Training</td><td>Jupyter Notebook</td></tr>
</table>

</td>
<td valign="top" width="50%">

<h3>☁️ Infra</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>Cloud</td><td>AWS</td></tr>
<tr><td>Compute</td><td>EC2</td></tr>
<tr><td>Container</td><td>Docker</td></tr>
<tr><td>Image Registry</td><td>AWS ECR</td></tr>
<tr><td>Orchestration</td><td>AWS ECS</td></tr>
<tr><td>Network</td><td>AWS VPC</td></tr>
<tr><td>Storage</td><td>Amazon S3</td></tr>
</table>

</td>
</tr>
</table>

<table width="100%">
<tr>
<td valign="top" width="50%">

<h3>🔄 DevOps / CI·CD</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>CI</td><td>GitHub Actions</td></tr>
<tr><td>Test Automation</td><td>pytest, flake8</td></tr>
<tr><td>Build</td><td>Gradle, Maven</td></tr>
<tr><td>Deployment</td><td>Docker 기반 자동 배포</td></tr>
</table>

</td>
<td valign="top" width="50%">

<h3>🧠 MLOps</h3>

<table>
<tr><th>구분</th><th>사용 기술</th></tr>
<tr><td>Experiment / Analysis</td><td>Jupyter Notebook</td></tr>
<tr><td>Pipeline</td><td>Azure ML</td></tr>
<tr><td>CLI</td><td>Azure CLI</td></tr>
</table>

</td>
</tr>
</table>

##
## 🏗 System Architecture
Tuzain은 AI 주식 투자 보조 서비스를 제공하는 메인 웹과,  
분석 API를 활용할 수 있는 개발자 웹을 분리하여 설계된 마이크로서비스 기반 시스템입니다.

메인 웹은 일반 사용자를 대상으로 뉴스·재무·주가 데이터를 통합 분석한  
AI 투자 보조 기능을 제공하며,  
개발자 웹은 Tuzain에서 구축한 분석 API를 외부 서비스에서도 활용할 수 있도록 지원합니다.

<img width="663" height="326" alt="image" src="https://github.com/user-attachments/assets/e76e5bd6-3428-4476-b8fa-47c07fbfd459" />

##
## 🌐 Infrastructure / Request Flow
Tuzain은 사용자 웹(tuzain.com)과 개발자 웹(developer.tuzain.com)을 분리 운영하며,
각 요청은 AWS 네트워크 구성(IGW/ALB/Route Table)을 통해 웹 프록시(Nginx)와 API 서버로 라우팅됩니다.
API 서버는 Private Subnet에 배치하여 외부 접근을 제한하고, 데이터는 RDS를 통해 관리합니다.

<img width="761" height="445" alt="image" src="https://github.com/user-attachments/assets/6c521b91-ebd5-4c5b-840b-eb0563c5b2e0" />

## 🔄 DevOps / CI·CD
(PR → 테스트/빌드 → Docker → ECR → ECS)

<img width="759" height="423" alt="image" src="https://github.com/user-attachments/assets/277964bc-7f87-4a8e-8834-6fb7f82137fe" />

##

<h2>✨ 주요 기능 & 화면 구성</h2>

<p>
Tuzain은 뉴스·재무·차트·리포트·API 제공까지<br/>
AI 기반 주식 투자 보조 기능을 단계적으로 제공합니다.
</p>

<table width="100%">
<tr>
<td valign="top" width="50%">

<h3>📰 뉴스 투자 분석</h3>
<p>
AI가 시장 맥락을 반영해 뉴스를 분석하고,<br/>
투자 관점에서 해석된 요약 정보를 제공합니다.
</p>
<img src="https://github.com/user-attachments/assets/09dd06c0-f8b6-4c90-8e79-7ef00ef7c8ff" width="420"/>
<ul>
  <li>미국 주식 관련 뉴스 자동 수집</li>
  <li>뉴스 감성 및 시장 영향 분석</li>
  <li>투자 판단에 도움이 되는 AI 요약 제공</li>
</ul>

</td>
<td valign="top" width="50%">

<h3>📊 재무제표 기반 투자 분석</h3>
<p>
복잡한 재무제표를 자동으로 분석해<br/>
핵심 지표와 투자 관점을 직관적으로 제공합니다.
</p>
<img src="https://github.com/user-attachments/assets/786eec48-750e-467a-83ab-2aa9d16ad8d7" width="420"/>
<ul>
  <li>연간 재무제표 자동 수집 및 분석</li>
  <li>주요 재무 지표 요약 제공</li>
  <li>투자 판단을 위한 AI 해석 제공</li>
</ul>

</td>
</tr>

<tr>
<td valign="top" width="50%">

<h3>🔍 종목 탐색 & 관련 뉴스</h3>
<p>
종목 검색을 통해 재무 정보와 연관 뉴스를 함께 확인할 수 있으며,<br/>
AI 분석 결과를 기반으로 투자 판단에 필요한 정보를 제공합니다.
</p>
<img src="https://github.com/user-attachments/assets/1a891b73-c616-4a90-82ef-feb0acba9771" width="420"/>
<ul>
  <li>종목 검색 및 요약 정보 제공</li>
  <li>관련 뉴스 자동 연결</li>
  <li>뉴스 분석 결과 연동</li>
</ul>

</td>
<td valign="top" width="50%">

<h3>📈 주식 차트 분석</h3>
<p>
주가 흐름과 주요 지표를 시각화하여<br/>
직관적인 투자 판단을 지원합니다.
</p>
<img src="https://github.com/user-attachments/assets/52f6c146-39e6-421c-a8fa-fcaf722dfbfb" width="420"/>
<ul>
  <li>주가 · 변동률 · PER 등 주요 지표 제공</li>
  <li>차트 기반 시각적 분석 지원</li>
  <li>다중 종목 비교 기능 제공</li>
</ul>

</td>
</tr>

<tr>
<td valign="top" width="50%">

<h3>📝 리포트 센터</h3>
<p>
Tuzain은 전문가 및 사용자 리포트를 한 곳에서 확인하고,<br/>
투자 인사이트를 공유할 수 있는 <b>리포트 중심 공간</b>을 제공합니다.
</p>
<img src="https://github.com/user-attachments/assets/0cb47e43-cd3d-4b0d-a82b-21636a090956" width="420"/>
<ul>
  <li><b>전문가 분석 리포트 제공</b></li>
  <li>사용자 의견 작성 및 공유</li>
  <li>투자 인사이트 아카이빙</li>
</ul>

</td>
<td valign="top" width="50%">

<h3>🔗 분석 API 제공 (Developer Web)</h3>
<p>
Tuzain은 AI 기반 뉴스·재무·주가 분석 기능을 외부 서비스에서도 활용할 수 있도록  
개발자 전용 API를 제공합니다.
</p>
<img src="https://github.com/user-attachments/assets/e92a3c9c-ff85-4f58-86ea-2f0ebaaec133" width="420"/>
<ul>
  <li><b>API Key 발급 및 관리</b></li>
  <li>뉴스 · 재무 · 분석 기능 API 제공</li>
  <li>외부 서비스 및 시스템 연동 지원</li>
</ul>

</td>
</tr>
</table>



##
