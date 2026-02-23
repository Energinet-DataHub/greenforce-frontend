import * as Types from './types';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInviteUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { inviteUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInviteUserMutation = (resolver: GraphQLResponseResolver<Types.InviteUserMutation, Types.InviteUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.InviteUserMutation, Types.InviteUserMutationVariables>(
    'inviteUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeactivateUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { deactivateUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeactivateUserMutation = (resolver: GraphQLResponseResolver<Types.DeactivateUserMutation, Types.DeactivateUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeactivateUserMutation, Types.DeactivateUserMutationVariables>(
    'deactivateUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateUserRoleMutation = (resolver: GraphQLResponseResolver<Types.CreateUserRoleMutation, Types.CreateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateUserRoleMutation, Types.CreateUserRoleMutationVariables>(
    'CreateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReActivateUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { reActivateUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReActivateUserMutation = (resolver: GraphQLResponseResolver<Types.ReActivateUserMutation, Types.ReActivateUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ReActivateUserMutation, Types.ReActivateUserMutationVariables>(
    'reActivateUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeactivateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { deactivateUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeactivateUserRoleMutation = (resolver: GraphQLResponseResolver<Types.DeactivateUserRoleMutation, Types.DeactivateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeactivateUserRoleMutation, Types.DeactivateUserRoleMutationVariables>(
    'deactivateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReInviteUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { reInviteUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReInviteUserMutation = (resolver: GraphQLResponseResolver<Types.ReInviteUserMutation, Types.ReInviteUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ReInviteUserMutation, Types.ReInviteUserMutationVariables>(
    'reInviteUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReset2faMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { resetTwoFactorAuthentication }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReset2faMutation = (resolver: GraphQLResponseResolver<Types.Reset2faMutation, Types.Reset2faMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.Reset2faMutation, Types.Reset2faMutationVariables>(
    'reset2fa',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockResetMitIdMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { resetMitId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockResetMitIdMutation = (resolver: GraphQLResponseResolver<Types.ResetMitIdMutation, Types.ResetMitIdMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ResetMitIdMutation, Types.ResetMitIdMutationVariables>(
    'ResetMitId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCheckEmailExistsQuery(
 *   ({ query, variables }) => {
 *     const { email } = variables;
 *     return HttpResponse.json({
 *       data: { emailExists }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCheckEmailExistsQuery = (resolver: GraphQLResponseResolver<Types.CheckEmailExistsQuery, Types.CheckEmailExistsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.CheckEmailExistsQuery, Types.CheckEmailExistsQueryVariables>(
    'CheckEmailExists',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCheckDomainExistsQuery(
 *   ({ query, variables }) => {
 *     const { email } = variables;
 *     return HttpResponse.json({
 *       data: { domainExists }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCheckDomainExistsQuery = (resolver: GraphQLResponseResolver<Types.CheckDomainExistsQuery, Types.CheckDomainExistsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.CheckDomainExistsQuery, Types.CheckDomainExistsQueryVariables>(
    'CheckDomainExists',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserAndRolesMutation(
 *   ({ query, variables }) => {
 *     const { updateUserInput, updateRolesInput } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserIdentity, updateUserRoleAssignment }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserAndRolesMutation = (resolver: GraphQLResponseResolver<Types.UpdateUserAndRolesMutation, Types.UpdateUserAndRolesMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateUserAndRolesMutation, Types.UpdateUserAndRolesMutationVariables>(
    'updateUserAndRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserRoleMutation = (resolver: GraphQLResponseResolver<Types.UpdateUserRoleMutation, Types.UpdateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateUserRoleMutation, Types.UpdateUserRoleMutationVariables>(
    'UpdateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdatePermissionMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updatePermission }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdatePermissionMutation = (resolver: GraphQLResponseResolver<Types.UpdatePermissionMutation, Types.UpdatePermissionMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdatePermissionMutation, Types.UpdatePermissionMutationVariables>(
    'UpdatePermission',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFilteredMarketParticipantsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { filteredMarketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetFilteredMarketParticipantsQuery = (resolver: GraphQLResponseResolver<Types.GetFilteredMarketParticipantsQuery, Types.GetFilteredMarketParticipantsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetFilteredMarketParticipantsQuery, Types.GetFilteredMarketParticipantsQueryVariables>(
    'GetFilteredMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFilteredUserRolesQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions, status, after, before, first, last, filter, order } = variables;
 *     return HttpResponse.json({
 *       data: { filteredUserRoles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetFilteredUserRolesQuery = (resolver: GraphQLResponseResolver<Types.GetFilteredUserRolesQuery, Types.GetFilteredUserRolesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetFilteredUserRolesQuery, Types.GetFilteredUserRolesQueryVariables>(
    'GetFilteredUserRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFilteredPermissionsQuery(
 *   ({ query, variables }) => {
 *     const { after, before, first, last, filter, order } = variables;
 *     return HttpResponse.json({
 *       data: { filteredPermissions }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetFilteredPermissionsQuery = (resolver: GraphQLResponseResolver<Types.GetFilteredPermissionsQuery, Types.GetFilteredPermissionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetFilteredPermissionsQuery, Types.GetFilteredPermissionsQueryVariables>(
    'GetFilteredPermissions',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionByEicFunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicFunction } = variables;
 *     return HttpResponse.json({
 *       data: { permissionsByEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionByEicFunctionQuery = (resolver: GraphQLResponseResolver<Types.GetPermissionByEicFunctionQuery, Types.GetPermissionByEicFunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPermissionByEicFunctionQuery, Types.GetPermissionByEicFunctionQueryVariables>(
    'GetPermissionByEicFunction',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAssociatedMarketParticipantsQuery(
 *   ({ query, variables }) => {
 *     const { email } = variables;
 *     return HttpResponse.json({
 *       data: { associatedMarketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAssociatedMarketParticipantsQuery = (resolver: GraphQLResponseResolver<Types.GetAssociatedMarketParticipantsQuery, Types.GetAssociatedMarketParticipantsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAssociatedMarketParticipantsQuery, Types.GetAssociatedMarketParticipantsQueryVariables>(
    'GetAssociatedMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { permissionById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionAuditLogsQuery = (resolver: GraphQLResponseResolver<Types.GetPermissionAuditLogsQuery, Types.GetPermissionAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPermissionAuditLogsQuery, Types.GetPermissionAuditLogsQueryVariables>(
    'GetPermissionAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSelectionMarketParticipantsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { selectionMarketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSelectionMarketParticipantsQuery = (resolver: GraphQLResponseResolver<Types.GetSelectionMarketParticipantsQuery, Types.GetSelectionMarketParticipantsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSelectionMarketParticipantsQuery, Types.GetSelectionMarketParticipantsQueryVariables>(
    'GetSelectionMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionEditQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { permissionById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionEditQuery = (resolver: GraphQLResponseResolver<Types.GetPermissionEditQuery, Types.GetPermissionEditQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPermissionEditQuery, Types.GetPermissionEditQueryVariables>(
    'GetPermissionEdit',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionDetailsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { permissionById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionDetailsQuery = (resolver: GraphQLResponseResolver<Types.GetPermissionDetailsQuery, Types.GetPermissionDetailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPermissionDetailsQuery, Types.GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { userId } = variables;
 *     return HttpResponse.json({
 *       data: { userById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserAuditLogsQuery = (resolver: GraphQLResponseResolver<Types.GetUserAuditLogsQuery, Types.GetUserAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserAuditLogsQuery, Types.GetUserAuditLogsQueryVariables>(
    'GetUserAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserEditQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserEditQuery = (resolver: GraphQLResponseResolver<Types.GetUserEditQuery, Types.GetUserEditQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserEditQuery, Types.GetUserEditQueryVariables>(
    'GetUserEdit',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRoleAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userRoleById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRoleAuditLogsQuery = (resolver: GraphQLResponseResolver<Types.GetUserRoleAuditLogsQuery, Types.GetUserRoleAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRoleAuditLogsQuery, Types.GetUserRoleAuditLogsQueryVariables>(
    'GetUserRoleAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserDetailsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserDetailsQuery = (resolver: GraphQLResponseResolver<Types.GetUserDetailsQuery, Types.GetUserDetailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserDetailsQuery, Types.GetUserDetailsQueryVariables>(
    'GetUserDetails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesByActorIdQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { userRolesByActorId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesByActorIdQuery = (resolver: GraphQLResponseResolver<Types.GetUserRolesByActorIdQuery, Types.GetUserRolesByActorIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRolesByActorIdQuery, Types.GetUserRolesByActorIdQueryVariables>(
    'GetUserRolesByActorId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { userRoles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesQuery = (resolver: GraphQLResponseResolver<Types.GetUserRolesQuery, Types.GetUserRolesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRolesQuery, Types.GetUserRolesQueryVariables>(
    'GetUserRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUsersForCsvQuery(
 *   ({ query, variables }) => {
 *     const { actorId, userStatus, userRoleIds, skip, take, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { users }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUsersForCsvQuery = (resolver: GraphQLResponseResolver<Types.GetUsersForCsvQuery, Types.GetUsersForCsvQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUsersForCsvQuery, Types.GetUsersForCsvQueryVariables>(
    'GetUsersForCsv',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUsersQuery(
 *   ({ query, variables }) => {
 *     const { actorId, userRoleIds, userStatus, skip, take, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { users }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUsersQuery = (resolver: GraphQLResponseResolver<Types.GetUsersQuery, Types.GetUsersQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUsersQuery, Types.GetUsersQueryVariables>(
    'GetUsers',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDismissAllNotificationsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { dismissAllNotifications }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDismissAllNotificationsMutation = (resolver: GraphQLResponseResolver<Types.DismissAllNotificationsMutation, Types.DismissAllNotificationsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DismissAllNotificationsMutation, Types.DismissAllNotificationsMutationVariables>(
    'DismissAllNotifications',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRoleWithPermissionsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userRoleById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRoleWithPermissionsQuery = (resolver: GraphQLResponseResolver<Types.GetUserRoleWithPermissionsQuery, Types.GetUserRoleWithPermissionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRoleWithPermissionsQuery, Types.GetUserRoleWithPermissionsQueryVariables>(
    'GetUserRoleWithPermissions',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDismissNotificationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { dismissNotification }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDismissNotificationMutation = (resolver: GraphQLResponseResolver<Types.DismissNotificationMutation, Types.DismissNotificationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DismissNotificationMutation, Types.DismissNotificationMutationVariables>(
    'DismissNotification',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetNotificationsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { notifications }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetNotificationsQuery = (resolver: GraphQLResponseResolver<Types.GetNotificationsQuery, Types.GetNotificationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetNotificationsQuery, Types.GetNotificationsQueryVariables>(
    'GetNotifications',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { settlementReportById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSettlementReportQuery = (resolver: GraphQLResponseResolver<Types.GetSettlementReportQuery, Types.GetSettlementReportQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSettlementReportQuery, Types.GetSettlementReportQueryVariables>(
    'GetSettlementReport',
    resolver,
    options
  )


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockManuallyHandleOutgoingMessageMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { manuallyHandleOutgoingMessage }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockManuallyHandleOutgoingMessageMutation = (resolver: GraphQLResponseResolver<Types.ManuallyHandleOutgoingMessageMutation, Types.ManuallyHandleOutgoingMessageMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ManuallyHandleOutgoingMessageMutation, Types.ManuallyHandleOutgoingMessageMutationVariables>(
    'ManuallyHandleOutgoingMessage',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsAndUserRolesQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsAndUserRolesQuery = (resolver: GraphQLResponseResolver<Types.GetActorsAndUserRolesQuery, Types.GetActorsAndUserRolesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetActorsAndUserRolesQuery, Types.GetActorsAndUserRolesQueryVariables>(
    'GetActorsAndUserRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBalanceResponsibleByIdQuery(
 *   ({ query, variables }) => {
 *     const { documentId } = variables;
 *     return HttpResponse.json({
 *       data: { balanceResponsibleById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBalanceResponsibleByIdQuery = (resolver: GraphQLResponseResolver<Types.GetBalanceResponsibleByIdQuery, Types.GetBalanceResponsibleByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetBalanceResponsibleByIdQuery, Types.GetBalanceResponsibleByIdQueryVariables>(
    'GetBalanceResponsibleById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessageByIdQuery(
 *   ({ query, variables }) => {
 *     const { documentId } = variables;
 *     return HttpResponse.json({
 *       data: { esettOutgoingMessageById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOutgoingMessageByIdQuery = (resolver: GraphQLResponseResolver<Types.GetOutgoingMessageByIdQuery, Types.GetOutgoingMessageByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOutgoingMessageByIdQuery, Types.GetOutgoingMessageByIdQueryVariables>(
    'GetOutgoingMessageById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBalanceResponsibleMessagesQuery(
 *   ({ query, variables }) => {
 *     const { skip, take, order, locale } = variables;
 *     return HttpResponse.json({
 *       data: { balanceResponsible }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBalanceResponsibleMessagesQuery = (resolver: GraphQLResponseResolver<Types.GetBalanceResponsibleMessagesQuery, Types.GetBalanceResponsibleMessagesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetBalanceResponsibleMessagesQuery, Types.GetBalanceResponsibleMessagesQueryVariables>(
    'GetBalanceResponsibleMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessagesQuery(
 *   ({ query, variables }) => {
 *     const { skip, take, periodInterval, sentInterval, gridAreaCodes, createdInterval, calculationType, documentStatuses, timeSeriesType, filter, actorNumber, order } = variables;
 *     return HttpResponse.json({
 *       data: { esettExchangeEvents }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOutgoingMessagesQuery = (resolver: GraphQLResponseResolver<Types.GetOutgoingMessagesQuery, Types.GetOutgoingMessagesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOutgoingMessagesQuery, Types.GetOutgoingMessagesQueryVariables>(
    'GetOutgoingMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockResendExchangeMessagesMutation(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { resendWaitingEsettExchangeMessages }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockResendExchangeMessagesMutation = (resolver: GraphQLResponseResolver<Types.ResendExchangeMessagesMutation, Types.ResendExchangeMessagesMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ResendExchangeMessagesMutation, Types.ResendExchangeMessagesMutationVariables>(
    'ResendExchangeMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDownloadEsettExchangeEventsQuery(
 *   ({ query, variables }) => {
 *     const { locale, periodInterval, createdInterval, sentInterval, gridAreaCodes, calculationType, timeSeriesType, documentStatuses, documentId, order, actorNumber } = variables;
 *     return HttpResponse.json({
 *       data: { downloadEsettExchangeEvents }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDownloadEsettExchangeEventsQuery = (resolver: GraphQLResponseResolver<Types.DownloadEsettExchangeEventsQuery, Types.DownloadEsettExchangeEventsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.DownloadEsettExchangeEventsQuery, Types.DownloadEsettExchangeEventsQueryVariables>(
    'DownloadEsettExchangeEvents',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesMonthOverviewQuery(
 *   ({ query, variables }) => {
 *     const { year, month, areaCode } = variables;
 *     return HttpResponse.json({
 *       data: { imbalancePricesForMonth }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetImbalancePricesMonthOverviewQuery = (resolver: GraphQLResponseResolver<Types.GetImbalancePricesMonthOverviewQuery, Types.GetImbalancePricesMonthOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetImbalancePricesMonthOverviewQuery, Types.GetImbalancePricesMonthOverviewQueryVariables>(
    'GetImbalancePricesMonthOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetStatusReportQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { esettExchangeStatusReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetStatusReportQuery = (resolver: GraphQLResponseResolver<Types.GetStatusReportQuery, Types.GetStatusReportQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetStatusReportQuery, Types.GetStatusReportQueryVariables>(
    'GetStatusReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetServiceStatusQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { esettServiceStatus }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetServiceStatusQuery = (resolver: GraphQLResponseResolver<Types.GetServiceStatusQuery, Types.GetServiceStatusQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetServiceStatusQuery, Types.GetServiceStatusQueryVariables>(
    'GetServiceStatus',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesOverviewQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { imbalancePricesOverview }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetImbalancePricesOverviewQuery = (resolver: GraphQLResponseResolver<Types.GetImbalancePricesOverviewQuery, Types.GetImbalancePricesOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetImbalancePricesOverviewQuery, Types.GetImbalancePricesOverviewQueryVariables>(
    'GetImbalancePricesOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserProfileMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserProfile }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserProfileMutation = (resolver: GraphQLResponseResolver<Types.UpdateUserProfileMutation, Types.UpdateUserProfileMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateUserProfileMutation, Types.UpdateUserProfileMutationVariables>(
    'UpdateUserProfile',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserProfileQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { userProfile }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserProfileQuery = (resolver: GraphQLResponseResolver<Types.UserProfileQuery, Types.UserProfileQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UserProfileQuery, Types.UserProfileQueryVariables>(
    'userProfile',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateCalculationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createCalculation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateCalculationMutation = (resolver: GraphQLResponseResolver<Types.CreateCalculationMutation, Types.CreateCalculationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateCalculationMutation, Types.CreateCalculationMutationVariables>(
    'CreateCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantsForRequestCalculationQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantsForRequestCalculationQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantsForRequestCalculationQuery, Types.GetMarketParticipantsForRequestCalculationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantsForRequestCalculationQuery, Types.GetMarketParticipantsForRequestCalculationQueryVariables>(
    'GetMarketParticipantsForRequestCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { calculationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetCalculationByIdQuery = (resolver: GraphQLResponseResolver<Types.GetCalculationByIdQuery, Types.GetCalculationByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetCalculationByIdQuery, Types.GetCalculationByIdQueryVariables>(
    'GetCalculationById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCancelScheduledCalculationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { cancelScheduledCalculation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCancelScheduledCalculationMutation = (resolver: GraphQLResponseResolver<Types.CancelScheduledCalculationMutation, Types.CancelScheduledCalculationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CancelScheduledCalculationMutation, Types.CancelScheduledCalculationMutationVariables>(
    'CancelScheduledCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { request }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestMutation = (resolver: GraphQLResponseResolver<Types.RequestMutation, Types.RequestMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestMutation, Types.RequestMutationVariables>(
    'request',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetRequestOptionsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { requestOptions }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetRequestOptionsQuery = (resolver: GraphQLResponseResolver<Types.GetRequestOptionsQuery, Types.GetRequestOptionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetRequestOptionsQuery, Types.GetRequestOptionsQueryVariables>(
    'GetRequestOptions',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestMissingMeasurementsLogMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestMissingMeasurementsLog }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestMissingMeasurementsLogMutation = (resolver: GraphQLResponseResolver<Types.RequestMissingMeasurementsLogMutation, Types.RequestMissingMeasurementsLogMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestMissingMeasurementsLogMutation, Types.RequestMissingMeasurementsLogMutationVariables>(
    'requestMissingMeasurementsLog',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetRequestsQuery(
 *   ({ query, variables }) => {
 *     const { first, last, after, before, order } = variables;
 *     return HttpResponse.json({
 *       data: { requests }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetRequestsQuery = (resolver: GraphQLResponseResolver<Types.GetRequestsQuery, Types.GetRequestsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetRequestsQuery, Types.GetRequestsQueryVariables>(
    'GetRequests',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery(
 *   ({ query, variables }) => {
 *     const { input, first, last, after, before, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { calculations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetCalculationsQuery = (resolver: GraphQLResponseResolver<Types.GetCalculationsQuery, Types.GetCalculationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetCalculationsQuery, Types.GetCalculationsQueryVariables>(
    'GetCalculations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSelectedMarketParticipantQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { selectedMarketParticipant }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSelectedMarketParticipantQuery = (resolver: GraphQLResponseResolver<Types.GetSelectedMarketParticipantQuery, Types.GetSelectedMarketParticipantQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSelectedMarketParticipantQuery, Types.GetSelectedMarketParticipantQueryVariables>(
    'GetSelectedMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetArchivedMessagesQuery(
 *   ({ query, variables }) => {
 *     const { created, senderId, receiverId, documentTypes, businessReasons, includeRelated, first, last, after, before, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { archivedMessages }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetArchivedMessagesQuery = (resolver: GraphQLResponseResolver<Types.GetArchivedMessagesQuery, Types.GetArchivedMessagesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetArchivedMessagesQuery, Types.GetArchivedMessagesQueryVariables>(
    'GetArchivedMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesForCsvQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions, status, after, before, first, last, filter, order } = variables;
 *     return HttpResponse.json({
 *       data: { filteredUserRoles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesForCsvQuery = (resolver: GraphQLResponseResolver<Types.GetUserRolesForCsvQuery, Types.GetUserRolesForCsvQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRolesForCsvQuery, Types.GetUserRolesForCsvQueryVariables>(
    'GetUserRolesForCsv',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAddChargeSeriesMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { addChargeSeries }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockAddChargeSeriesMutation = (resolver: GraphQLResponseResolver<Types.AddChargeSeriesMutation, Types.AddChargeSeriesMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.AddChargeSeriesMutation, Types.AddChargeSeriesMutationVariables>(
    'AddChargeSeries',
    resolver,
    options
  )


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateChargeMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createCharge }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateChargeMutation = (resolver: GraphQLResponseResolver<Types.CreateChargeMutation, Types.CreateChargeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateChargeMutation, Types.CreateChargeMutationVariables>(
    'CreateCharge',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetLatestCalculationQuery(
 *   ({ query, variables }) => {
 *     const { calculationType, period } = variables;
 *     return HttpResponse.json({
 *       data: { latestCalculation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetLatestCalculationQuery = (resolver: GraphQLResponseResolver<Types.GetLatestCalculationQuery, Types.GetLatestCalculationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetLatestCalculationQuery, Types.GetLatestCalculationQueryVariables>(
    'GetLatestCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargesQuery(
 *   ({ query, variables }) => {
 *     const { after, before, first, last, query, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { charges }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargesQuery = (resolver: GraphQLResponseResolver<Types.GetChargesQuery, Types.GetChargesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargesQuery, Types.GetChargesQueryVariables>(
    'GetCharges',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockStopChargeMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { stopCharge }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockStopChargeMutation = (resolver: GraphQLResponseResolver<Types.StopChargeMutation, Types.StopChargeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.StopChargeMutation, Types.StopChargeMutationVariables>(
    'StopCharge',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeSeriesQuery(
 *   ({ query, variables }) => {
 *     const { chargeId, interval } = variables;
 *     return HttpResponse.json({
 *       data: { chargeById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeSeriesQuery = (resolver: GraphQLResponseResolver<Types.GetChargeSeriesQuery, Types.GetChargeSeriesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeSeriesQuery, Types.GetChargeSeriesQueryVariables>(
    'GetChargeSeries',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { chargeById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeByIdQuery = (resolver: GraphQLResponseResolver<Types.GetChargeByIdQuery, Types.GetChargeByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeByIdQuery, Types.GetChargeByIdQueryVariables>(
    'GetChargeById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateChargeMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateCharge }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateChargeMutation = (resolver: GraphQLResponseResolver<Types.UpdateChargeMutation, Types.UpdateChargeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateChargeMutation, Types.UpdateChargeMutationVariables>(
    'UpdateCharge',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProcessByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { processById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetProcessByIdQuery = (resolver: GraphQLResponseResolver<Types.GetProcessByIdQuery, Types.GetProcessByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetProcessByIdQuery, Types.GetProcessByIdQueryVariables>(
    'GetProcessById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesByEicfunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicfunction } = variables;
 *     return HttpResponse.json({
 *       data: { userRolesByEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesByEicfunctionQuery = (resolver: GraphQLResponseResolver<Types.GetUserRolesByEicfunctionQuery, Types.GetUserRolesByEicfunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetUserRolesByEicfunctionQuery, Types.GetUserRolesByEicfunctionQueryVariables>(
    'GetUserRolesByEicfunction',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProcessesQuery(
 *   ({ query, variables }) => {
 *     const { input, after, before, first, last, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { processes }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetProcessesQuery = (resolver: GraphQLResponseResolver<Types.GetProcessesQuery, Types.GetProcessesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetProcessesQuery, Types.GetProcessesQueryVariables>(
    'GetProcesses',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreaOverviewQuery(
 *   ({ query, variables }) => {
 *     const { after, before, first, last, filter, type, statuses, order } = variables;
 *     return HttpResponse.json({
 *       data: { gridAreaOverviewItems }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetGridAreaOverviewQuery = (resolver: GraphQLResponseResolver<Types.GetGridAreaOverviewQuery, Types.GetGridAreaOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetGridAreaOverviewQuery, Types.GetGridAreaOverviewQueryVariables>(
    'GetGridAreaOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreaDetailsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { gridAreaOverviewItemById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetGridAreaDetailsQuery = (resolver: GraphQLResponseResolver<Types.GetGridAreaDetailsQuery, Types.GetGridAreaDetailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetGridAreaDetailsQuery, Types.GetGridAreaDetailsQueryVariables>(
    'GetGridAreaDetails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateDelegationForMarketParticipantMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createDelegationsForMarketParticipant }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateDelegationForMarketParticipantMutation = (resolver: GraphQLResponseResolver<Types.CreateDelegationForMarketParticipantMutation, Types.CreateDelegationForMarketParticipantMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateDelegationForMarketParticipantMutation, Types.CreateDelegationForMarketParticipantMutationVariables>(
    'createDelegationForMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDownloadMeteringGridAreaImbalanceQuery(
 *   ({ query, variables }) => {
 *     const { locale, created, calculationPeriod, gridAreaCodes, documentId, valuesToInclude, order } = variables;
 *     return HttpResponse.json({
 *       data: { downloadMeteringGridAreaImbalance }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDownloadMeteringGridAreaImbalanceQuery = (resolver: GraphQLResponseResolver<Types.DownloadMeteringGridAreaImbalanceQuery, Types.DownloadMeteringGridAreaImbalanceQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.DownloadMeteringGridAreaImbalanceQuery, Types.DownloadMeteringGridAreaImbalanceQueryVariables>(
    'DownloadMeteringGridAreaImbalance',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockStopDelegationsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { stopDelegation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockStopDelegationsMutation = (resolver: GraphQLResponseResolver<Types.StopDelegationsMutation, Types.StopDelegationsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.StopDelegationsMutation, Types.StopDelegationsMutationVariables>(
    'stopDelegations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAddMeteringPointsToAdditionalRecipientMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { addMeteringPointsToAdditionalRecipient }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockAddMeteringPointsToAdditionalRecipientMutation = (resolver: GraphQLResponseResolver<Types.AddMeteringPointsToAdditionalRecipientMutation, Types.AddMeteringPointsToAdditionalRecipientMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.AddMeteringPointsToAdditionalRecipientMutation, Types.AddMeteringPointsToAdditionalRecipientMutationVariables>(
    'AddMeteringPointsToAdditionalRecipient',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringGridAreaImbalanceQuery(
 *   ({ query, variables }) => {
 *     const { skip, take, created, calculationPeriod, gridAreaCodes, filter, valuesToInclude, order } = variables;
 *     return HttpResponse.json({
 *       data: { meteringGridAreaImbalance }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringGridAreaImbalanceQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringGridAreaImbalanceQuery, Types.GetMeteringGridAreaImbalanceQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringGridAreaImbalanceQuery, Types.GetMeteringGridAreaImbalanceQueryVariables>(
    'GetMeteringGridAreaImbalance',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAdditionalRecipientOfMeasurementsQuery(
 *   ({ query, variables }) => {
 *     const { marketParticipantId } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAdditionalRecipientOfMeasurementsQuery = (resolver: GraphQLResponseResolver<Types.GetAdditionalRecipientOfMeasurementsQuery, Types.GetAdditionalRecipientOfMeasurementsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAdditionalRecipientOfMeasurementsQuery, Types.GetAdditionalRecipientOfMeasurementsQueryVariables>(
    'GetAdditionalRecipientOfMeasurements',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringGridAreaImbalanceByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { meteringGridAreaImbalanceById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringGridAreaImbalanceByIdQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringGridAreaImbalanceByIdQuery, Types.GetMeteringGridAreaImbalanceByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringGridAreaImbalanceByIdQuery, Types.GetMeteringGridAreaImbalanceByIdQueryVariables>(
    'GetMeteringGridAreaImbalanceById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantAuditLogsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantAuditLogsQuery, Types.GetMarketParticipantAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantAuditLogsQuery, Types.GetMarketParticipantAuditLogsQueryVariables>(
    'GetMarketParticipantAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBalanceResponsibleRelationQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBalanceResponsibleRelationQuery = (resolver: GraphQLResponseResolver<Types.GetBalanceResponsibleRelationQuery, Types.GetBalanceResponsibleRelationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetBalanceResponsibleRelationQuery, Types.GetBalanceResponsibleRelationQueryVariables>(
    'GetBalanceResponsibleRelation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantsByOrganizationIdQuery(
 *   ({ query, variables }) => {
 *     const { organizationId } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantsByOrganizationId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantsByOrganizationIdQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantsByOrganizationIdQuery, Types.GetMarketParticipantsByOrganizationIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantsByOrganizationIdQuery, Types.GetMarketParticipantsByOrganizationIdQueryVariables>(
    'GetMarketParticipantsByOrganizationId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantCredentialsQuery(
 *   ({ query, variables }) => {
 *     const { marketParticipantId } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantCredentialsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantCredentialsQuery, Types.GetMarketParticipantCredentialsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantCredentialsQuery, Types.GetMarketParticipantCredentialsQueryVariables>(
    'GetMarketParticipantCredentials',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetDelegatesQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetDelegatesQuery = (resolver: GraphQLResponseResolver<Types.GetDelegatesQuery, Types.GetDelegatesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetDelegatesQuery, Types.GetDelegatesQueryVariables>(
    'getDelegates',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPaginatedMarketParticipantsQuery(
 *   ({ query, variables }) => {
 *     const { after, before, first, last, filter, eicFunctions, statuses, order } = variables;
 *     return HttpResponse.json({
 *       data: { paginatedMarketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPaginatedMarketParticipantsQuery = (resolver: GraphQLResponseResolver<Types.GetPaginatedMarketParticipantsQuery, Types.GetPaginatedMarketParticipantsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPaginatedMarketParticipantsQuery, Types.GetPaginatedMarketParticipantsQueryVariables>(
    'GetPaginatedMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantDetailsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantDetailsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantDetailsQuery, Types.GetMarketParticipantDetailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantDetailsQuery, Types.GetMarketParticipantDetailsQueryVariables>(
    'GetMarketParticipantDetails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMergeMarketParticipantsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { mergeMarketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockMergeMarketParticipantsMutation = (resolver: GraphQLResponseResolver<Types.MergeMarketParticipantsMutation, Types.MergeMarketParticipantsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.MergeMarketParticipantsMutation, Types.MergeMarketParticipantsMutationVariables>(
    'MergeMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantEditableFieldsQuery(
 *   ({ query, variables }) => {
 *     const { marketParticipantId } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantEditableFieldsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantEditableFieldsQuery, Types.GetMarketParticipantEditableFieldsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantEditableFieldsQuery, Types.GetMarketParticipantEditableFieldsQueryVariables>(
    'GetMarketParticipantEditableFields',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateMarketParticipantMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateMarketParticipant }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateMarketParticipantMutation = (resolver: GraphQLResponseResolver<Types.UpdateMarketParticipantMutation, Types.UpdateMarketParticipantMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateMarketParticipantMutation, Types.UpdateMarketParticipantMutationVariables>(
    'UpdateMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetDelegationsForMarketParticipantQuery(
 *   ({ query, variables }) => {
 *     const { marketParticipantId } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetDelegationsForMarketParticipantQuery = (resolver: GraphQLResponseResolver<Types.GetDelegationsForMarketParticipantQuery, Types.GetDelegationsForMarketParticipantQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetDelegationsForMarketParticipantQuery, Types.GetDelegationsForMarketParticipantQueryVariables>(
    'GetDelegationsForMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationEditQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { organizationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationEditQuery = (resolver: GraphQLResponseResolver<Types.GetOrganizationEditQuery, Types.GetOrganizationEditQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOrganizationEditQuery, Types.GetOrganizationEditQueryVariables>(
    'GetOrganizationEdit',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationFromCvrQuery(
 *   ({ query, variables }) => {
 *     const { cvr } = variables;
 *     return HttpResponse.json({
 *       data: { searchOrganizationInCVR }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationFromCvrQuery = (resolver: GraphQLResponseResolver<Types.GetOrganizationFromCvrQuery, Types.GetOrganizationFromCvrQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOrganizationFromCvrQuery, Types.GetOrganizationFromCvrQueryVariables>(
    'GetOrganizationFromCVR',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAuditLogByOrganizationIdQuery(
 *   ({ query, variables }) => {
 *     const { organizationId } = variables;
 *     return HttpResponse.json({
 *       data: { organizationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAuditLogByOrganizationIdQuery = (resolver: GraphQLResponseResolver<Types.GetAuditLogByOrganizationIdQuery, Types.GetAuditLogByOrganizationIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAuditLogByOrganizationIdQuery, Types.GetAuditLogByOrganizationIdQueryVariables>(
    'GetAuditLogByOrganizationId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRemoveMeteringPointsFromAdditionalRecipientMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { removeMeteringPointsFromAdditionalRecipient }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRemoveMeteringPointsFromAdditionalRecipientMutation = (resolver: GraphQLResponseResolver<Types.RemoveMeteringPointsFromAdditionalRecipientMutation, Types.RemoveMeteringPointsFromAdditionalRecipientMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RemoveMeteringPointsFromAdditionalRecipientMutation, Types.RemoveMeteringPointsFromAdditionalRecipientMutationVariables>(
    'RemoveMeteringPointsFromAdditionalRecipient',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateMarketParticipantMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createMarketParticipant }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateMarketParticipantMutation = (resolver: GraphQLResponseResolver<Types.CreateMarketParticipantMutation, Types.CreateMarketParticipantMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateMarketParticipantMutation, Types.CreateMarketParticipantMutationVariables>(
    'CreateMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { organizations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationsQuery = (resolver: GraphQLResponseResolver<Types.GetOrganizationsQuery, Types.GetOrganizationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOrganizationsQuery, Types.GetOrganizationsQueryVariables>(
    'GetOrganizations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestClientSecretCredentialsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestClientSecretCredentials }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestClientSecretCredentialsMutation = (resolver: GraphQLResponseResolver<Types.RequestClientSecretCredentialsMutation, Types.RequestClientSecretCredentialsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestClientSecretCredentialsMutation, Types.RequestClientSecretCredentialsMutationVariables>(
    'RequestClientSecretCredentials',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateOrganizationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateOrganization }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateOrganizationMutation = (resolver: GraphQLResponseResolver<Types.UpdateOrganizationMutation, Types.UpdateOrganizationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateOrganizationMutation, Types.UpdateOrganizationMutationVariables>(
    'UpdateOrganization',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCloseConversationMutation(
 *   ({ query, variables }) => {
 *     const { conversationId } = variables;
 *     return HttpResponse.json({
 *       data: { closeConversation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCloseConversationMutation = (resolver: GraphQLResponseResolver<Types.CloseConversationMutation, Types.CloseConversationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CloseConversationMutation, Types.CloseConversationMutationVariables>(
    'CloseConversation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { organizationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationByIdQuery = (resolver: GraphQLResponseResolver<Types.GetOrganizationByIdQuery, Types.GetOrganizationByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetOrganizationByIdQuery, Types.GetOrganizationByIdQueryVariables>(
    'GetOrganizationById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockStartConversationMutation(
 *   ({ query, variables }) => {
 *     const { subject, meteringPointIdentification, internalNote, content, anonymous, receiver } = variables;
 *     return HttpResponse.json({
 *       data: { startConversation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockStartConversationMutation = (resolver: GraphQLResponseResolver<Types.StartConversationMutation, Types.StartConversationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.StartConversationMutation, Types.StartConversationMutationVariables>(
    'StartConversation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetConversationsQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointIdentification } = variables;
 *     return HttpResponse.json({
 *       data: { conversationsForMeteringPoint }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetConversationsQuery = (resolver: GraphQLResponseResolver<Types.GetConversationsQuery, Types.GetConversationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetConversationsQuery, Types.GetConversationsQueryVariables>(
    'GetConversations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSendActorConversationMessageMutation(
 *   ({ query, variables }) => {
 *     const { conversationId, meteringPointIdentification, actorId, userId, content, anonymous } = variables;
 *     return HttpResponse.json({
 *       data: { sendActorConversationMessage }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockSendActorConversationMessageMutation = (resolver: GraphQLResponseResolver<Types.SendActorConversationMessageMutation, Types.SendActorConversationMessageMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.SendActorConversationMessageMutation, Types.SendActorConversationMessageMutationVariables>(
    'SendActorConversationMessage',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetConversationQuery(
 *   ({ query, variables }) => {
 *     const { conversationId, meteringPointId } = variables;
 *     return HttpResponse.json({
 *       data: { conversation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetConversationQuery = (resolver: GraphQLResponseResolver<Types.GetConversationQuery, Types.GetConversationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetConversationQuery, Types.GetConversationQueryVariables>(
    'GetConversation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPaginatedOrganizationsQuery(
 *   ({ query, variables }) => {
 *     const { after, before, first, last, order, filter } = variables;
 *     return HttpResponse.json({
 *       data: { paginatedOrganizations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPaginatedOrganizationsQuery = (resolver: GraphQLResponseResolver<Types.GetPaginatedOrganizationsQuery, Types.GetPaginatedOrganizationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetPaginatedOrganizationsQuery, Types.GetPaginatedOrganizationsQueryVariables>(
    'GetPaginatedOrganizations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateChargeLinkMutation(
 *   ({ query, variables }) => {
 *     const { chargeId, meteringPointId, newStartDate, factor } = variables;
 *     return HttpResponse.json({
 *       data: { createChargeLink }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateChargeLinkMutation = (resolver: GraphQLResponseResolver<Types.CreateChargeLinkMutation, Types.CreateChargeLinkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateChargeLinkMutation, Types.CreateChargeLinkMutationVariables>(
    'CreateChargeLink',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCancelChargeLinkMutation(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { cancelChargeLink }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCancelChargeLinkMutation = (resolver: GraphQLResponseResolver<Types.CancelChargeLinkMutation, Types.CancelChargeLinkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CancelChargeLinkMutation, Types.CancelChargeLinkMutationVariables>(
    'CancelChargeLink',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMarkConversationReadMutation(
 *   ({ query, variables }) => {
 *     const { conversationId } = variables;
 *     return HttpResponse.json({
 *       data: { markConversationRead }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockMarkConversationReadMutation = (resolver: GraphQLResponseResolver<Types.MarkConversationReadMutation, Types.MarkConversationReadMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.MarkConversationReadMutation, Types.MarkConversationReadMutationVariables>(
    'MarkConversationRead',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeLinkByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { chargeLinkById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeLinkByIdQuery = (resolver: GraphQLResponseResolver<Types.GetChargeLinkByIdQuery, Types.GetChargeLinkByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeLinkByIdQuery, Types.GetChargeLinkByIdQueryVariables>(
    'GetChargeLinkById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeLinksByMeteringPointIdQuery(
 *   ({ query, variables }) => {
 *     const { order, meteringPointId } = variables;
 *     return HttpResponse.json({
 *       data: { chargeLinksByMeteringPointId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeLinksByMeteringPointIdQuery = (resolver: GraphQLResponseResolver<Types.GetChargeLinksByMeteringPointIdQuery, Types.GetChargeLinksByMeteringPointIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeLinksByMeteringPointIdQuery, Types.GetChargeLinksByMeteringPointIdQueryVariables>(
    'GetChargeLinksByMeteringPointId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeLinkHistoryQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { chargeLinkById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeLinkHistoryQuery = (resolver: GraphQLResponseResolver<Types.GetChargeLinkHistoryQuery, Types.GetChargeLinkHistoryQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeLinkHistoryQuery, Types.GetChargeLinkHistoryQueryVariables>(
    'GetChargeLinkHistory',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointDebugViewQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId } = variables;
 *     return HttpResponse.json({
 *       data: { debugView }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointDebugViewQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointDebugViewQuery, Types.GetMeteringPointDebugViewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointDebugViewQuery, Types.GetMeteringPointDebugViewQueryVariables>(
    'GetMeteringPointDebugView',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetChargeByTypeQuery(
 *   ({ query, variables }) => {
 *     const { type } = variables;
 *     return HttpResponse.json({
 *       data: { chargesByType }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetChargeByTypeQuery = (resolver: GraphQLResponseResolver<Types.GetChargeByTypeQuery, Types.GetChargeByTypeQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetChargeByTypeQuery, Types.GetChargeByTypeQueryVariables>(
    'GetChargeByType',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointEventsDebugViewQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId } = variables;
 *     return HttpResponse.json({
 *       data: { eventsDebugView }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointEventsDebugViewQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointEventsDebugViewQuery, Types.GetMeteringPointEventsDebugViewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointEventsDebugViewQuery, Types.GetMeteringPointEventsDebugViewQueryVariables>(
    'GetMeteringPointEventsDebugView',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockEditChargeLinkMutation(
 *   ({ query, variables }) => {
 *     const { id, newStartDate, factor } = variables;
 *     return HttpResponse.json({
 *       data: { editChargeLink }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockEditChargeLinkMutation = (resolver: GraphQLResponseResolver<Types.EditChargeLinkMutation, Types.EditChargeLinkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.EditChargeLinkMutation, Types.EditChargeLinkMutationVariables>(
    'EditChargeLink',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointsByGridAreaQuery(
 *   ({ query, variables }) => {
 *     const { gridAreaCode } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointsByGridAreaCode }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointsByGridAreaQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointsByGridAreaQuery, Types.GetMeteringPointsByGridAreaQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointsByGridAreaQuery, Types.GetMeteringPointsByGridAreaQueryVariables>(
    'GetMeteringPointsByGridArea',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAggregatedMeasurementsForAllYearsQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, actorNumber, marketRole } = variables;
 *     return HttpResponse.json({
 *       data: { aggregatedMeasurementsForAllYears }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAggregatedMeasurementsForAllYearsQuery = (resolver: GraphQLResponseResolver<Types.GetAggregatedMeasurementsForAllYearsQuery, Types.GetAggregatedMeasurementsForAllYearsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAggregatedMeasurementsForAllYearsQuery, Types.GetAggregatedMeasurementsForAllYearsQueryVariables>(
    'GetAggregatedMeasurementsForAllYears',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSelectableDatesForEndOfSupplyQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { selectableDatesForEndOfSupply }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSelectableDatesForEndOfSupplyQuery = (resolver: GraphQLResponseResolver<Types.GetSelectableDatesForEndOfSupplyQuery, Types.GetSelectableDatesForEndOfSupplyQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSelectableDatesForEndOfSupplyQuery, Types.GetSelectableDatesForEndOfSupplyQueryVariables>(
    'GetSelectableDatesForEndOfSupply',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeasurementPointsQuery(
 *   ({ query, variables }) => {
 *     const { observationTime, meteringPointId, date, actorNumber, marketRole } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPoint, measurementPoints }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeasurementPointsQuery = (resolver: GraphQLResponseResolver<Types.GetMeasurementPointsQuery, Types.GetMeasurementPointsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeasurementPointsQuery, Types.GetMeasurementPointsQueryVariables>(
    'GetMeasurementPoints',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMarkConversationUnReadMutation(
 *   ({ query, variables }) => {
 *     const { conversationId } = variables;
 *     return HttpResponse.json({
 *       data: { markConversationUnRead }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockMarkConversationUnReadMutation = (resolver: GraphQLResponseResolver<Types.MarkConversationUnReadMutation, Types.MarkConversationUnReadMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.MarkConversationUnReadMutation, Types.MarkConversationUnReadMutationVariables>(
    'MarkConversationUnRead',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAggregatedMeasurementsForMonthQuery(
 *   ({ query, variables }) => {
 *     const { showOnlyChangedValues, meteringPointId, yearMonth, actorNumber, marketRole } = variables;
 *     return HttpResponse.json({
 *       data: { aggregatedMeasurementsForMonth }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAggregatedMeasurementsForMonthQuery = (resolver: GraphQLResponseResolver<Types.GetAggregatedMeasurementsForMonthQuery, Types.GetAggregatedMeasurementsForMonthQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAggregatedMeasurementsForMonthQuery, Types.GetAggregatedMeasurementsForMonthQueryVariables>(
    'GetAggregatedMeasurementsForMonth',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeasurementsQuery(
 *   ({ query, variables }) => {
 *     const { showOnlyChangedValues, showHistoricValues, meteringPointId, date, actorNumber, marketRole } = variables;
 *     return HttpResponse.json({
 *       data: { measurements }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeasurementsQuery = (resolver: GraphQLResponseResolver<Types.GetMeasurementsQuery, Types.GetMeasurementsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeasurementsQuery, Types.GetMeasurementsQueryVariables>(
    'GetMeasurements',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockStopChargeLinkMutation(
 *   ({ query, variables }) => {
 *     const { id, stopDate } = variables;
 *     return HttpResponse.json({
 *       data: { stopChargeLink }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockStopChargeLinkMutation = (resolver: GraphQLResponseResolver<Types.StopChargeLinkMutation, Types.StopChargeLinkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.StopChargeLinkMutation, Types.StopChargeLinkMutationVariables>(
    'StopChargeLink',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestEndOfSupplyMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestEndOfSupply }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestEndOfSupplyMutation = (resolver: GraphQLResponseResolver<Types.RequestEndOfSupplyMutation, Types.RequestEndOfSupplyMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestEndOfSupplyMutation, Types.RequestEndOfSupplyMutationVariables>(
    'RequestEndOfSupply',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInitiateMoveInMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { initiateMoveIn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInitiateMoveInMutation = (resolver: GraphQLResponseResolver<Types.InitiateMoveInMutation, Types.InitiateMoveInMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.InitiateMoveInMutation, Types.InitiateMoveInMutationVariables>(
    'InitiateMoveIn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestChangeCustomerCharacteristicsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { changeCustomerCharacteristics }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestChangeCustomerCharacteristicsMutation = (resolver: GraphQLResponseResolver<Types.RequestChangeCustomerCharacteristicsMutation, Types.RequestChangeCustomerCharacteristicsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestChangeCustomerCharacteristicsMutation, Types.RequestChangeCustomerCharacteristicsMutationVariables>(
    'RequestChangeCustomerCharacteristics',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetArchivedMessagesForMeteringPointQuery(
 *   ({ query, variables }) => {
 *     const { created, meteringPointId, senderId, receiverId, documentType, first, last, after, before, order } = variables;
 *     return HttpResponse.json({
 *       data: { archivedMessagesForMeteringPoint }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetArchivedMessagesForMeteringPointQuery = (resolver: GraphQLResponseResolver<Types.GetArchivedMessagesForMeteringPointQuery, Types.GetArchivedMessagesForMeteringPointQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetArchivedMessagesForMeteringPointQuery, Types.GetArchivedMessagesForMeteringPointQueryVariables>(
    'GetArchivedMessagesForMeteringPoint',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetContactCprQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, contactId } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointContactCpr }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetContactCprQuery = (resolver: GraphQLResponseResolver<Types.GetContactCprQuery, Types.GetContactCprQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetContactCprQuery, Types.GetContactCprQueryVariables>(
    'GetContactCPR',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockExecuteMeteringPointManualCorrectionMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { executeMeteringPointManualCorrection }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockExecuteMeteringPointManualCorrectionMutation = (resolver: GraphQLResponseResolver<Types.ExecuteMeteringPointManualCorrectionMutation, Types.ExecuteMeteringPointManualCorrectionMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.ExecuteMeteringPointManualCorrectionMutation, Types.ExecuteMeteringPointManualCorrectionMutationVariables>(
    'ExecuteMeteringPointManualCorrection',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFailedSendMeasurementsInstancesQuery(
 *   ({ query, variables }) => {
 *     const { created, filter, first, last, after, before, order } = variables;
 *     return HttpResponse.json({
 *       data: { failedSendMeasurementsInstances }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetFailedSendMeasurementsInstancesQuery = (resolver: GraphQLResponseResolver<Types.GetFailedSendMeasurementsInstancesQuery, Types.GetFailedSendMeasurementsInstancesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetFailedSendMeasurementsInstancesQuery, Types.GetFailedSendMeasurementsInstancesQueryVariables>(
    'GetFailedSendMeasurementsInstances',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointByIdQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, actorGln, searchMigratedMeteringPoints } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPoint }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointByIdQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointByIdQuery, Types.GetMeteringPointByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointByIdQuery, Types.GetMeteringPointByIdQueryVariables>(
    'GetMeteringPointById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointForManualCorrectionQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointForManualCorrection }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointForManualCorrectionQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointForManualCorrectionQuery, Types.GetMeteringPointForManualCorrectionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointForManualCorrectionQuery, Types.GetMeteringPointForManualCorrectionQueryVariables>(
    'GetMeteringPointForManualCorrection',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetRelatedMeteringPointsByIdQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointIdentification, searchMigratedMeteringPoints } = variables;
 *     return HttpResponse.json({
 *       data: { relatedMeteringPoints }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetRelatedMeteringPointsByIdQuery = (resolver: GraphQLResponseResolver<Types.GetRelatedMeteringPointsByIdQuery, Types.GetRelatedMeteringPointsByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetRelatedMeteringPointsByIdQuery, Types.GetRelatedMeteringPointsByIdQueryVariables>(
    'GetRelatedMeteringPointsById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAggregatedMeasurementsForYearQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, year, actorNumber, marketRole } = variables;
 *     return HttpResponse.json({
 *       data: { aggregatedMeasurementsForYear }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAggregatedMeasurementsForYearQuery = (resolver: GraphQLResponseResolver<Types.GetAggregatedMeasurementsForYearQuery, Types.GetAggregatedMeasurementsForYearQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetAggregatedMeasurementsForYearQuery, Types.GetAggregatedMeasurementsForYearQueryVariables>(
    'GetAggregatedMeasurementsForYear',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestConnectionStateChangeMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestConnectionStateChange }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestConnectionStateChangeMutation = (resolver: GraphQLResponseResolver<Types.RequestConnectionStateChangeMutation, Types.RequestConnectionStateChangeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestConnectionStateChangeMutation, Types.RequestConnectionStateChangeMutationVariables>(
    'RequestConnectionStateChange',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointProcessByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointProcessById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointProcessByIdQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointProcessByIdQuery, Types.GetMeteringPointProcessByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointProcessByIdQuery, Types.GetMeteringPointProcessByIdQueryVariables>(
    'GetMeteringPointProcessById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSendMeasurementsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { sendMeasurements }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockSendMeasurementsMutation = (resolver: GraphQLResponseResolver<Types.SendMeasurementsMutation, Types.SendMeasurementsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.SendMeasurementsMutation, Types.SendMeasurementsMutationVariables>(
    'SendMeasurements',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointProcessOverviewQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, created } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointProcessOverview }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointProcessOverviewQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointProcessOverviewQuery, Types.GetMeteringPointProcessOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointProcessOverviewQuery, Types.GetMeteringPointProcessOverviewQueryVariables>(
    'GetMeteringPointProcessOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringPointUploadMetadataByIdQuery(
 *   ({ query, variables }) => {
 *     const { meteringPointId, searchMigratedMeteringPoints } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPoint }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringPointUploadMetadataByIdQuery = (resolver: GraphQLResponseResolver<Types.GetMeteringPointUploadMetadataByIdQuery, Types.GetMeteringPointUploadMetadataByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeteringPointUploadMetadataByIdQuery, Types.GetMeteringPointUploadMetadataByIdQueryVariables>(
    'GetMeteringPointUploadMetadataById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeasurementsReportsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { measurementsReports }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeasurementsReportsQuery = (resolver: GraphQLResponseResolver<Types.GetMeasurementsReportsQuery, Types.GetMeasurementsReportsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMeasurementsReportsQuery, Types.GetMeasurementsReportsQueryVariables>(
    'GetMeasurementsReports',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCancelSettlementReportMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { cancelSettlementReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCancelSettlementReportMutation = (resolver: GraphQLResponseResolver<Types.CancelSettlementReportMutation, Types.CancelSettlementReportMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CancelSettlementReportMutation, Types.CancelSettlementReportMutationVariables>(
    'CancelSettlementReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestMeasurementsReportMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestMeasurementsReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestMeasurementsReportMutation = (resolver: GraphQLResponseResolver<Types.RequestMeasurementsReportMutation, Types.RequestMeasurementsReportMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestMeasurementsReportMutation, Types.RequestMeasurementsReportMutationVariables>(
    'RequestMeasurementsReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantOptionsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { marketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantOptionsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantOptionsQuery, Types.GetMarketParticipantOptionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantOptionsQuery, Types.GetMarketParticipantOptionsQueryVariables>(
    'GetMarketParticipantOptions',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetReleaseTogglesQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { releaseToggles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetReleaseTogglesQuery = (resolver: GraphQLResponseResolver<Types.GetReleaseTogglesQuery, Types.GetReleaseTogglesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetReleaseTogglesQuery, Types.GetReleaseTogglesQueryVariables>(
    'GetReleaseToggles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { settlementReports }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSettlementReportsQuery = (resolver: GraphQLResponseResolver<Types.GetSettlementReportsQuery, Types.GetSettlementReportsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSettlementReportsQuery, Types.GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSimulateMeteringPointManualCorrectionMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { simulateMeteringPointManualCorrection }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockSimulateMeteringPointManualCorrectionMutation = (resolver: GraphQLResponseResolver<Types.SimulateMeteringPointManualCorrectionMutation, Types.SimulateMeteringPointManualCorrectionMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.SimulateMeteringPointManualCorrectionMutation, Types.SimulateMeteringPointManualCorrectionMutationVariables>(
    'SimulateMeteringPointManualCorrection',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportCalculationsByGridAreasQuery(
 *   ({ query, variables }) => {
 *     const { calculationType, gridAreaIds, calculationPeriod } = variables;
 *     return HttpResponse.json({
 *       data: { settlementReportGridAreaCalculationsForPeriod }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSettlementReportCalculationsByGridAreasQuery = (resolver: GraphQLResponseResolver<Types.GetSettlementReportCalculationsByGridAreasQuery, Types.GetSettlementReportCalculationsByGridAreasQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetSettlementReportCalculationsByGridAreasQuery, Types.GetSettlementReportCalculationsByGridAreasQueryVariables>(
    'GetSettlementReportCalculationsByGridAreas',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAddTokenToDownloadUrlMutation(
 *   ({ query, variables }) => {
 *     const { url } = variables;
 *     return HttpResponse.json({
 *       data: { addTokenToDownloadUrl }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockAddTokenToDownloadUrlMutation = (resolver: GraphQLResponseResolver<Types.AddTokenToDownloadUrlMutation, Types.AddTokenToDownloadUrlMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.AddTokenToDownloadUrlMutation, Types.AddTokenToDownloadUrlMutationVariables>(
    'addTokenToDownloadUrl',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestSettlementReportMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestSettlementReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestSettlementReportMutation = (resolver: GraphQLResponseResolver<Types.RequestSettlementReportMutation, Types.RequestSettlementReportMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.RequestSettlementReportMutation, Types.RequestSettlementReportMutationVariables>(
    'RequestSettlementReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantByIdQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantByIdQuery, Types.GetMarketParticipantByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantByIdQuery, Types.GetMarketParticipantByIdQueryVariables>(
    'GetMarketParticipantById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantsForEicFunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { marketParticipantsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantsForEicFunctionQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantsForEicFunctionQuery, Types.GetMarketParticipantsForEicFunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantsForEicFunctionQuery, Types.GetMarketParticipantsForEicFunctionQueryVariables>(
    'GetMarketParticipantsForEicFunction',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInitiateMitIdSignupMutation(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { initiateMitIdSignup }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInitiateMitIdSignupMutation = (resolver: GraphQLResponseResolver<Types.InitiateMitIdSignupMutation, Types.InitiateMitIdSignupMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.InitiateMitIdSignupMutation, Types.InitiateMitIdSignupMutationVariables>(
    'InitiateMitIdSignup',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDoesInternalMeteringPointIdExistQuery(
 *   ({ query, variables }) => {
 *     const { internalMeteringPointId, meteringPointId, searchMigratedMeteringPoints } = variables;
 *     return HttpResponse.json({
 *       data: { meteringPointExists }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDoesInternalMeteringPointIdExistQuery = (resolver: GraphQLResponseResolver<Types.DoesInternalMeteringPointIdExistQuery, Types.DoesInternalMeteringPointIdExistQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.DoesInternalMeteringPointIdExistQuery, Types.DoesInternalMeteringPointIdExistQueryVariables>(
    'DoesInternalMeteringPointIdExist',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { gridAreas }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetGridAreasQuery = (resolver: GraphQLResponseResolver<Types.GetGridAreasQuery, Types.GetGridAreasQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetGridAreasQuery, Types.GetGridAreasQueryVariables>(
    'GetGridAreas',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMarketParticipantsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { marketParticipants }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMarketParticipantsQuery = (resolver: GraphQLResponseResolver<Types.GetMarketParticipantsQuery, Types.GetMarketParticipantsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetMarketParticipantsQuery, Types.GetMarketParticipantsQueryVariables>(
    'GetMarketParticipants',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetRelevantGridAreasQuery(
 *   ({ query, variables }) => {
 *     const { actorId, period, environment } = variables;
 *     return HttpResponse.json({
 *       data: { relevantGridAreas }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetRelevantGridAreasQuery = (resolver: GraphQLResponseResolver<Types.GetRelevantGridAreasQuery, Types.GetRelevantGridAreasQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.GetRelevantGridAreasQuery, Types.GetRelevantGridAreasQueryVariables>(
    'GetRelevantGridAreas',
    resolver,
    options
  )
