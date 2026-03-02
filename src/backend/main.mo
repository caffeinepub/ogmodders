import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Mod = {
    id : Nat;
    title : Text;
    category : Text;
    author : Text;
    tags : [Text];
    image : Text;
    description : Text;
    downloadUrl : Text;
  };

  var nextId = 0;
  let mods = Map.empty<Nat, Mod>();

  public query ({ caller }) func getMods() : async [Mod] {
    mods.values().toArray();
  };

  public shared ({ caller }) func addMod(
    title : Text,
    category : Text,
    author : Text,
    tags : [Text],
    image : Text,
    description : Text,
    downloadUrl : Text,
  ) : async Nat {
    let newMod : Mod = {
      id = nextId;
      title;
      category;
      author;
      tags;
      image;
      description;
      downloadUrl;
    };
    mods.add(nextId, newMod);
    nextId += 1;
    nextId - 1;
  };

  public shared ({ caller }) func updateMod(
    id : Nat,
    title : Text,
    category : Text,
    author : Text,
    tags : [Text],
    image : Text,
    description : Text,
    downloadUrl : Text,
  ) : async Bool {
    switch (mods.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedMod : Mod = {
          id;
          title;
          category;
          author;
          tags;
          image;
          description;
          downloadUrl;
        };
        mods.add(id, updatedMod);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteMod(id : Nat) : async Bool {
    switch (mods.get(id)) {
      case (?_) {
        mods.remove(id);
        true;
      };
      case (null) {
        false;
      };
    };
  };
};
