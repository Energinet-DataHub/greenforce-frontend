/**
 * Extract public members of a class by excluding private members.
 */
export type PublicMembers<TClass> = {
  [TPublicMemberKey in keyof TClass]: TClass[TPublicMemberKey];
};
