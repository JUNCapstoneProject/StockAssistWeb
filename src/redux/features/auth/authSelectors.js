/**
 * ✅ 로그인 여부를 반환하는 selector
 * - true: 로그인 상태
 * - false: 비로그인 상태
 * - 로그인 확인 완료 후 사용 권장 (isLoginChecked와 함께)
 */
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

/**
 * ✅ 로그인 상태 확인 여부를 반환
 * - true: 로그인 상태 확인 완료 (서버에 check 완료됨)
 * - false: 아직 로그인 확인 전 (App 또는 Navbar에서 초기 호출 전)
 * 
 * 사용 목적:
 * - 초기 렌더링 시 "깜빡임" 방지
 * - 로그인 상태를 조건부로 렌더링할 때 사용
 */
export const selectIsLoginChecked = (state) => state.auth.isLoginChecked;

/**
 * ✅ accessToken을 반환하는 selector
 * - accessToken을 Redux에 저장하고 있을 경우 사용 가능
 * - 새로고침 시 복구 필요 (App에서 setAccessToken으로 복구)
 */
export const selectAccessToken = (state) => state.auth.accessToken;

/**
 * ✅ 전체 인증 상태 객체를 통째로 반환
 * - 필요 시 여러 상태를 동시에 가져와야 할 때 유용
 * - ex) const { isLoggedIn, accessToken } = useSelector(selectAuthState)
 */
export const selectAuthState = (state) => state.auth;
