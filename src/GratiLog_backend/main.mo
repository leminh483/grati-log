import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Map "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";

actor {
  type Result<T> = Result.Result<T, Text>;
  
  public type GratitudeCategory = {
    #Family;
    #Health;
    #Work;
    #Friends;
    #Nature;
    #Achievement;
    #Experience;
    #Other;
  };
  
  public type GratitudeEntry = {
    id: Nat;
    author: Principal;
    title: Text;
    content: Text;
    category: GratitudeCategory;
    mood_rating: Nat; // 1-5 scale
    is_public: Bool;
    created_at: Int;
    appreciations: Nat; // count of appreciations
  };
  
  public type Appreciation = {
    entry_id: Nat;
    appreciator: Principal;
    timestamp: Int;
  };
  
  public type UserStats = {
    total_entries: Nat;
    current_streak: Nat;
    longest_streak: Nat;
    entries_by_category: [(GratitudeCategory, Nat)];
    average_mood: Float;
  };
  
  public type EntryInput = {
    title: Text;
    content: Text;
    category: GratitudeCategory;
    mood_rating: Nat;
    is_public: Bool;
  };

  // Storage
  stable var nextId: Nat = 0;
  
  let principalMap = Map.Make<Principal>(Principal.compare);
  let natMap = Map.Make<Nat>(Nat.compare);
  
  // User entries: Principal -> Map<Nat, GratitudeEntry>
  stable var userEntries: Map.Map<Principal, Map.Map<Nat, GratitudeEntry>> = principalMap.empty();
  
  // Global appreciations: entry_id -> [Appreciation]
  stable var appreciations: Map.Map<Nat, [Appreciation]> = natMap.empty();
  
  // Helper function to get user's entries
  private func getUserEntries(user: Principal): Map.Map<Nat, GratitudeEntry> {
    switch (principalMap.get(userEntries, user)) {
      case (null) { natMap.empty() };
      case (?entries) { entries };
    };
  };
  
  // Helper function to update user's entries
  private func updateUserEntries(user: Principal, entries: Map.Map<Nat, GratitudeEntry>) {
    userEntries := principalMap.put(userEntries, user, entries);
  };
  
  // Calculate streak for a user
  private func calculateStreak(entries: [GratitudeEntry]): (Nat, Nat) {
    if (entries.size() == 0) { return (0, 0) };
    
    let sortedEntries = Array.sort<GratitudeEntry>(entries, func(a, b) {
      if (a.created_at > b.created_at) #greater
      else if (a.created_at < b.created_at) #less
      else #equal
    });
    
    var currentStreak: Nat = 0;
    var longestStreak: Nat = 0;
    var tempStreak: Nat = 1;
    
    if (sortedEntries.size() > 0) {
      let now = Time.now();
      let dayInNanos = 24 * 60 * 60 * 1_000_000_000;
      let yesterday = now - dayInNanos;
      
      // Check if last entry was today or yesterday
      if (sortedEntries[sortedEntries.size() - 1].created_at > yesterday) {
        currentStreak := 1;
        longestStreak := 1;
      };
      
      // Calculate streaks
      if (sortedEntries.size() > 1) {
        var i = sortedEntries.size();
        while (i > 1) {
          i -= 1;
          let dayDiff = (sortedEntries[i].created_at - sortedEntries[i-1].created_at) / dayInNanos;
          if (dayDiff <= 1) {
            tempStreak += 1;
            if (i + 1 == sortedEntries.size()) {
              currentStreak := tempStreak;
            };
          } else {
            if (tempStreak > longestStreak) {
              longestStreak := tempStreak;
            };
            tempStreak := 1;
          };
        };
      };
      
      if (tempStreak > longestStreak) {
        longestStreak := tempStreak;
      };
    };
    
    (currentStreak, longestStreak)
  };
  
  // Public functions
  public shared ({ caller }) func createEntry(input: EntryInput): async Result<GratitudeEntry> {
    if (input.title == "" or input.content == "") {
      return #err("Title and content cannot be empty");
    };
    
    if (input.mood_rating < 1 or input.mood_rating > 5) {
      return #err("Mood rating must be between 1 and 5");
    };
    
    let entry: GratitudeEntry = {
      id = nextId;
      author = caller;
      title = input.title;
      content = input.content;
      category = input.category;
      mood_rating = input.mood_rating;
      is_public = input.is_public;
      created_at = Time.now();
      appreciations = 0;
    };
    
    var currentUserEntries = getUserEntries(caller);
    currentUserEntries := natMap.put(currentUserEntries, nextId, entry);
    updateUserEntries(caller, currentUserEntries);
    
    nextId += 1;
    
    #ok(entry)
  };
  
  public shared query ({ caller }) func getMyEntries(): async Result<[GratitudeEntry]> {
    let entries = getUserEntries(caller);
    let entriesArray = Iter.toArray(
      Iter.map(
        natMap.entries(entries),
        func((_, entry): (Nat, GratitudeEntry)): GratitudeEntry { entry }
      )
    );
    
    let sortedEntries = Array.sort<GratitudeEntry>(entriesArray, func(a, b) {
      if (a.created_at > b.created_at) #greater
      else if (a.created_at < b.created_at) #less
      else #equal
    });
    
    #ok(sortedEntries)
  };
  
  public shared query func getPublicEntries(): async Result<[GratitudeEntry]> {
    var allPublicEntries: [GratitudeEntry] = [];
    
    for ((_, userEntriesMap) in principalMap.entries(userEntries)) {
      for ((_, entry) in natMap.entries(userEntriesMap)) {
        if (entry.is_public) {
          allPublicEntries := Array.append(allPublicEntries, [entry]);
        };
      };
    };
    
    let sortedEntries = Array.sort<GratitudeEntry>(allPublicEntries, func(a, b) {
      if (a.created_at > b.created_at) #greater
      else if (a.created_at < b.created_at) #less
      else #equal
    });
    
    #ok(sortedEntries)
  };
  
  public shared ({ caller }) func appreciateEntry(entryId: Nat): async Result<()> {
    // Find the entry across all users
    var entryFound: ?GratitudeEntry = null;
    var entryOwner: ?Principal = null;
    
    for ((user, userEntriesMap) in principalMap.entries(userEntries)) {
      switch (natMap.get(userEntriesMap, entryId)) {
        case (?entry) {
          entryFound := ?entry;
          entryOwner := ?user;
        };
        case null {};
      };
    };
    
    switch (entryFound, entryOwner) {
      case (?entry, ?owner) {
        if (not entry.is_public) {
          return #err("Cannot appreciate private entry");
        };
        
        if (entry.author == caller) {
          return #err("Cannot appreciate your own entry");
        };
        
        // Check if user already appreciated this entry
        let existingAppreciations = switch (natMap.get(appreciations, entryId)) {
          case null { [] };
          case (?apps) { apps };
        };
        
        for (app in existingAppreciations.vals()) {
          if (app.appreciator == caller) {
            return #err("Already appreciated this entry");
          };
        };
        
        // Add appreciation
        let newAppreciation: Appreciation = {
          entry_id = entryId;
          appreciator = caller;
          timestamp = Time.now();
        };
        
        let updatedAppreciations = Array.append(existingAppreciations, [newAppreciation]);
        appreciations := natMap.put(appreciations, entryId, updatedAppreciations);
        
        // Update entry appreciation count
        let updatedEntry = {
          id = entry.id;
          author = entry.author;
          title = entry.title;
          content = entry.content;
          category = entry.category;
          mood_rating = entry.mood_rating;
          is_public = entry.is_public;
          created_at = entry.created_at;
          appreciations = entry.appreciations + 1;
        };
        
        var ownerEntries = getUserEntries(owner);
        ownerEntries := natMap.put(ownerEntries, entryId, updatedEntry);
        updateUserEntries(owner, ownerEntries);
        
        #ok()
      };
      case _ {
        #err("Entry not found")
      };
    };
  };
  
  public shared ({ caller }) func deleteEntry(entryId: Nat): async Result<()> {
    var currentUserEntries = getUserEntries(caller);
    
    switch (natMap.get(currentUserEntries, entryId)) {
      case null { #err("Entry not found") };
      case (?entry) {
        if (entry.author != caller) {
          return #err("Not authorized to delete this entry");
        };
        
        let (updatedEntries, _) = natMap.remove(currentUserEntries, entryId);
        updateUserEntries(caller, updatedEntries);
        
        // Remove appreciations for this entry
        let (updatedAppreciations, _) = natMap.remove(appreciations, entryId);
        appreciations := updatedAppreciations;
        
        #ok()
      };
    };
  };
  
  public shared query ({ caller }) func getMyStats(): async Result<UserStats> {
    let entries = getUserEntries(caller);
    let entriesArray = Iter.toArray(
      Iter.map(
        natMap.entries(entries),
        func((_, entry): (Nat, GratitudeEntry)): GratitudeEntry { entry }
      )
    );
    
    if (entriesArray.size() == 0) {
      return #ok({
        total_entries = 0;
        current_streak = 0;
        longest_streak = 0;
        entries_by_category = [];
        average_mood = 0.0;
      });
    };
    
    let (currentStreak, longestStreak) = calculateStreak(entriesArray);
    
    // Calculate category distribution
    var familyCount: Nat = 0;
    var healthCount: Nat = 0;
    var workCount: Nat = 0;
    var friendsCount: Nat = 0;
    var natureCount: Nat = 0;
    var achievementCount: Nat = 0;
    var experienceCount: Nat = 0;
    var otherCount: Nat = 0;
    
    var totalMood: Nat = 0;
    
    for (entry in entriesArray.vals()) {
      switch (entry.category) {
        case (#Family) { familyCount += 1 };
        case (#Health) { healthCount += 1 };
        case (#Work) { workCount += 1 };
        case (#Friends) { friendsCount += 1 };
        case (#Nature) { natureCount += 1 };
        case (#Achievement) { achievementCount += 1 };
        case (#Experience) { experienceCount += 1 };
        case (#Other) { otherCount += 1 };
      };
      
      totalMood += entry.mood_rating;
    };
    
    let averageMood = if (entriesArray.size() > 0) {
      Float.fromInt64(Int64.fromNat64(Nat64.fromNat(totalMood))) / Float.fromInt64(Int64.fromNat64(Nat64.fromNat(entriesArray.size())))
    } else { 0.0 };
    
    let categoryCounts: [(GratitudeCategory, Nat)] = [
      (#Family, familyCount),
      (#Health, healthCount),
      (#Work, workCount),
      (#Friends, friendsCount),
      (#Nature, natureCount),
      (#Achievement, achievementCount),
      (#Experience, experienceCount),
      (#Other, otherCount),
    ];
    
    #ok({
      total_entries = entriesArray.size();
      current_streak = currentStreak;
      longest_streak = longestStreak;
      entries_by_category = categoryCounts;
      average_mood = averageMood;
    })
  };
  
  public shared query func getEntryAppreciations(entryId: Nat): async Result<[Appreciation]> {
    switch (natMap.get(appreciations, entryId)) {
      case null { #ok([]) };
      case (?apps) { #ok(apps) };
    };
  };
  
  // System functions
  public shared query func getSystemStats(): async {
    total_users: Nat;
    total_entries: Nat;
    total_public_entries: Nat;
    total_appreciations: Nat;
  } {
    var totalUsers: Nat = 0;
    var totalEntries: Nat = 0;
    var totalPublicEntries: Nat = 0;
    var totalAppreciations: Nat = 0;
    
    for ((_, userEntriesMap) in principalMap.entries(userEntries)) {
      totalUsers += 1;
      for ((_, entry) in natMap.entries(userEntriesMap)) {
        totalEntries += 1;
        if (entry.is_public) {
          totalPublicEntries += 1;
        };
      };
    };
    
    for ((_, apps) in natMap.entries(appreciations)) {
      totalAppreciations += apps.size();
    };
    
    {
      total_users = totalUsers;
      total_entries = totalEntries;
      total_public_entries = totalPublicEntries;
      total_appreciations = totalAppreciations;
    }
  };
}